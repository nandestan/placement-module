package storage

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sync"

	"go-placement-policy/internal/models"
)

var (
	ActivePolicyConfig models.PolicyConfig
	PolicyConfigMutex sync.RWMutex
	Students           []models.Student
	Companies = map[string]models.Company{
		"C001": {ID: "C001", Name: "Tech Innovators", OfferedSalary: 1500000},
		"C002": {ID: "C002", Name: "Global Corp", OfferedSalary: 1000000},
		"C003": {ID: "C003", Name: "Acme Corp", OfferedSalary: 3000000},
	}

	// Cached placement statistics
	PlacementStatsMutex       sync.RWMutex
	CachedTotalStudents       int
	CachedPlacedStudentsCount int
)

func init() {
	loadStudentsFromFile("internal/data/students.json")
	initializeDefaultPolicies()
	UpdatePlacementStats() // Crucial to initialize stats after loading students and setting default policies.
}

func initializeDefaultPolicies() {
	PolicyConfigMutex.Lock()
	defer PolicyConfigMutex.Unlock()

	// Default values for the placement policy configuration.
	// These can be overridden via the API.
	ActivePolicyConfig = models.PolicyConfig{
		MaximumCompanies: struct {
			Enabled bool `json:"enabled"`
			MaxN    int  `json:"maxN"`
		}{Enabled: true, MaxN: 5}, // Max 5 additional companies if already placed.
		DreamOffer: struct {
			Enabled bool `json:"enabled"`
		}{Enabled: true},
		DreamCompany: struct {
			Enabled bool `json:"enabled"`
		}{Enabled: true},
		CGPAThreshold: struct {
			Enabled           bool    `json:"enabled"`
			MinimumCGPA       float64 `json:"minimumCGPA"`
			HighSalaryThreshold float64 `json:"highSalaryThreshold"`
		}{Enabled: true, MinimumCGPA: 7.0, HighSalaryThreshold: 1200000}, // Min CGPA 7.0 for offers >= 12L.
		PlacementPercentage: struct {
			Enabled          bool    `json:"enabled"`
			TargetPercentage float64 `json:"targetPercentage"`
		}{Enabled: false, TargetPercentage: 80}, // Target 80% overall placement before placed students can re-apply (currently disabled).
		OfferCategory: struct {
			Enabled               bool    `json:"enabled"`
			L1ThresholdAmount     float64 `json:"l1ThresholdAmount"`
			L2ThresholdAmount     float64 `json:"l2ThresholdAmount"`
			RequiredHikePercentage float64 `json:"requiredHikePercentage"`
		}{Enabled: true, L1ThresholdAmount: 2000000, L2ThresholdAmount: 1000000, RequiredHikePercentage: 30}, // L1 > 20L, L2 > 10L, L2 needs 30% hike.
	}
	log.Println("Default policy configuration initialized.")
}

// loadStudentsFromFile attempts to load student data from a JSON file.
// It first tries the provided path relative to the project root,
// then attempts a path relative to the parent directory (common when running 'go run' from a subdirectory like cmd/api).
// If loading fails, it initializes an empty student list and logs a warning.
func loadStudentsFromFile(filePathFromProjectRoot string) {
	wd, err := os.Getwd()
	if err != nil {
		log.Printf("Warning: Could not get current working directory: %v. Student data might not load.", err)
		Students = []models.Student{}
		return
	}

	absPath := filepath.Join(wd, filePathFromProjectRoot)

	// Attempt to find the file, checking an alternative path if the first doesn't exist.
	// This handles cases where the CWD might be project root or cmd/api/.
	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		altPath := filepath.Join(wd, "..", filePathFromProjectRoot) // Path if CWD is cmd/api
		if _, errStatAlt := os.Stat(altPath); errStatAlt == nil {
			absPath = altPath
		} else {
			log.Printf("Warning: Could not find students data file at '%s' or '%s'. Initializing with empty student list.", absPath, altPath)
			Students = []models.Student{}
			return
		}
	}

	data, err := ioutil.ReadFile(absPath)
	if err != nil {
		log.Printf("Warning: Could not read students data file '%s': %v. Initializing with empty student list.", absPath, err)
		Students = []models.Student{}
		return
	}

	if err := json.Unmarshal(data, &Students); err != nil {
		log.Printf("Warning: Could not unmarshal students data from '%s': %v. Initializing with empty student list.", absPath, err)
		Students = []models.Student{}
		return
	}
	log.Printf("Successfully loaded %d students from %s", len(Students), absPath)
	UpdatePlacementStats() // Ensure placement stats are current after loading student data.
}

// UpdatePlacementStats recalculates and caches the total number of students and placed students.
// This function is mutex-protected and should be invoked whenever the student list changes
// (e.g., after loading from file, creating a new student) or a student's placement status is updated.
func UpdatePlacementStats() {
	PlacementStatsMutex.Lock()
	defer PlacementStatsMutex.Unlock()

	CachedTotalStudents = len(Students)
	placedCount := 0
	for _, s := range Students {
		if s.IsPlaced {
			placedCount++
		}
	}
	CachedPlacedStudentsCount = placedCount
	log.Printf("Placement statistics updated: Total Students = %d, Placed Students = %d", CachedTotalStudents, CachedPlacedStudentsCount)
}
