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

// ConfigurePoliciesHandler handles POST requests to update policy configurations.
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

// CheckEligibilityHandler handles POST requests to check a student's eligibility for a company.
func CheckEligibilityHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		StudentID int `json:"studentId"`
		CompanyID string `json:"companyId"`
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	var student models.Student
	studentFound := false
	for _, s := range storage.Students {
		if s.ID == req.StudentID {
			student = s
			studentFound = true
			break
		}
	}

	company, companyExists := storage.Companies[req.CompanyID]

	if !studentFound {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}
	if !companyExists {
		http.Error(w, "Company not found", http.StatusNotFound)
		return
	}

	result := eligibility.PerformEligibilityCheck(student, company)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetPoliciesHandler handles GET requests to retrieve the current policy configurations.
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
func GetAllStudentsHandler(w http.ResponseWriter, r *http.Request) {
	// In a real application, you might have pagination or filtering here.
	studentsToReturn := storage.Students
	if studentsToReturn == nil {
		studentsToReturn = []models.Student{} // Return empty slice if nil, to ensure valid JSON array
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(studentsToReturn)
}

// GetStudentByIDHandler returns a single student by their ID.
func GetStudentByIDHandler(w http.ResponseWriter, r *http.Request) {
	studentIDStr := chi.URLParam(r, "studentID")
	studentID, err := strconv.Atoi(studentIDStr)
	if err != nil {
		http.Error(w, "Invalid student ID format", http.StatusBadRequest)
		return
	}

	var student models.Student
	found := false
	for _, s := range storage.Students {
		if s.ID == studentID {
			student = s
			found = true
			break
		}
	}

	if !found {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
}

// GetAllCompaniesHandler returns a list of all companies.
func GetAllCompaniesHandler(w http.ResponseWriter, r *http.Request) {
	storage.PolicyConfigMutex.RLock() // Use the same mutex for safety, or a dedicated one for companies if needed
	allCompaniesMap := storage.Companies
	storage.PolicyConfigMutex.RUnlock()

	// Convert map to slice for consistent JSON array output
	allCompaniesSlice := make([]models.Company, 0, len(allCompaniesMap))
	for _, company := range allCompaniesMap {
		allCompaniesSlice = append(allCompaniesSlice, company)
	}

	if allCompaniesSlice == nil {
		allCompaniesSlice = []models.Company{} // Ensure valid JSON array
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allCompaniesSlice)
}
