package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"go-placement-policy/internal/eligibility"
	"go-placement-policy/internal/models"
	"go-placement-policy/internal/storage"

	"github.com/go-chi/chi/v5"
)

// ConfigurePoliciesHandler accepts a POST request with a new policy configuration,
// updates the active policy in storage, and returns the updated configuration.
func ConfigurePoliciesHandler(w http.ResponseWriter, r *http.Request) {
	var newConfig models.PolicyConfig
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&newConfig); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	storage.PolicyConfigMutex.Lock()
	storage.ActivePolicyConfig = newConfig
	storage.PolicyConfigMutex.Unlock()

	log.Printf("Policy configuration updated: %+v\n", newConfig)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newConfig)
}

// CheckEligibilityHandler accepts a POST request with StudentID and CompanyID,
// checks the student's eligibility for the company, and returns the eligibility result.
func CheckEligibilityHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		StudentID int    `json:"studentId"`
		CompanyID string `json:"companyId"`
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	var student models.Student
	studentFound := false
	// Note: Iterating through all students here. For larger datasets, a map or indexed lookup would be more efficient.
	for _, s := range storage.Students {
		if s.ID == req.StudentID {
			student = s
			studentFound = true
			break
		}
	}

	var company models.Company
	companyFound := false
	for _, c := range storage.Companies { // Iterate over slice
		if c.ID == req.CompanyID {
			company = c
			companyFound = true
			break
		}
	}

	if !studentFound {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}
	if !companyFound { // Updated check
		http.Error(w, "Company not found", http.StatusNotFound)
		return
	}

	result := eligibility.PerformEligibilityCheck(student, company)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetPoliciesHandler handles GET requests to retrieve the current active policy configuration.
func GetPoliciesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET method is allowed", http.StatusMethodNotAllowed)
		return
	}

	storage.PolicyConfigMutex.RLock()
	currentConfig := storage.ActivePolicyConfig
	storage.PolicyConfigMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(currentConfig)
}

// GetAllStudentsHandler returns a list of all students.
// In a production system, pagination and filtering capabilities would be important here.
func GetAllStudentsHandler(w http.ResponseWriter, r *http.Request) {
	studentsToReturn := storage.Students
	if studentsToReturn == nil {
		studentsToReturn = []models.Student{} // Ensure a valid JSON array (empty) is returned instead of null.
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(studentsToReturn)
}

// GetStudentByIDHandler retrieves and returns a single student by their ID from the URL path.
func GetStudentByIDHandler(w http.ResponseWriter, r *http.Request) {
	studentIDStr := chi.URLParam(r, "studentID")
	studentID, err := strconv.Atoi(studentIDStr)
	if err != nil {
		http.Error(w, "Invalid student ID format in URL path", http.StatusBadRequest)
		return
	}

	var student models.Student
	found := false
	// RLock for reading Students data.
	// Consider a more granular lock if Students and PolicyConfig are frequently updated independently
	// or if student data becomes very large and this linear scan becomes a bottleneck.
	storage.PolicyConfigMutex.RLock()
	for _, s := range storage.Students {
		if s.ID == studentID {
			student = s
			found = true
			break
		}
	}
	storage.PolicyConfigMutex.RUnlock()

	if !found {
		http.Error(w, "Student not found for ID: "+studentIDStr, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
}

// GetAllCompaniesHandler returns a list of all companies.
// Companies are stored in a map; this handler converts it to a slice for JSON output.
func GetAllCompaniesHandler(w http.ResponseWriter, r *http.Request) {
	// Directly use the Companies slice, which is already loaded from JSON.
	companiesToReturn := storage.Companies
	if companiesToReturn == nil {
		companiesToReturn = []models.Company{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(companiesToReturn)
}

// GetEligibleStudentsForCompanyHandler retrieves all students eligible for a specific company.
// The company ID is taken from the URL path.
func GetEligibleStudentsForCompanyHandler(w http.ResponseWriter, r *http.Request) {
	companyID := chi.URLParam(r, "companyID")
	if companyID == "" {
		http.Error(w, "Company ID is required in URL path", http.StatusBadRequest)
		return
	}

	var company models.Company
	companyFound := false
	for _, c := range storage.Companies { // Iterate over slice
		if c.ID == companyID {
			company = c
			companyFound = true
			break
		}
	}

	if !companyFound { // Updated check, now using companyFound
		http.Error(w, "Company not found for ID: "+companyID, http.StatusNotFound)
		return
	}

	eligibleStudents := []models.Student{}
	// Iterate through all students and check eligibility for the given company.
	// The Students slice is read here. PolicyConfig is read within PerformEligibilityCheck (which handles its own locking).
	// If student data modification becomes frequent and concurrent, locking storage.Students might be needed here.
	for _, student := range storage.Students {
		result := eligibility.PerformEligibilityCheck(student, company)
		if result.IsEligible {
			eligibleStudents = append(eligibleStudents, student)
		}
	}

	if eligibleStudents == nil {
		eligibleStudents = []models.Student{} // Ensure valid JSON array.
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(eligibleStudents)
}

// CreateStudentHandler handles POST requests to create a new student.
// It decodes student data from the JSON body, assigns a new ID,
// appends the student to in-memory storage, updates placement stats, and returns the created student.
func CreateStudentHandler(w http.ResponseWriter, r *http.Request) {
	var newStudent models.Student
	if err := json.NewDecoder(r.Body).Decode(&newStudent); err != nil {
		http.Error(w, "Invalid JSON payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Basic validation for student name.
	if newStudent.FullName == "" {
		http.Error(w, "Student name cannot be empty", http.StatusBadRequest)
		return
	}

	storage.PolicyConfigMutex.Lock() // Lock to safely modify shared Students slice and generate ID.
	defer storage.PolicyConfigMutex.Unlock()

	// Assign a new ID - simple increment for this example.
	// In a production system, use a more robust ID generation strategy (e.g., UUID or database auto-increment).
	if len(storage.Students) > 0 {
		newStudent.ID = storage.Students[len(storage.Students)-1].ID + 1
	} else {
		newStudent.ID = 1 // First student in the system.
	}

	storage.Students = append(storage.Students, newStudent)
	storage.UpdatePlacementStats() // Crucial to update stats after adding a new student.

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newStudent)
}
