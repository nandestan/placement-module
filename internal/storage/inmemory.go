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
		"C001": {ID: "C001", Name: "Tech Innovators", OfferedSalary: 1500000}, // 15L [cite: 10]
		"C002": {ID: "C002", Name: "Global Corp", OfferedSalary: 1000000},
		"C003": {ID: "C003", Name: "Acme Corp", OfferedSalary: 3000000}, // 30L for L2 test case [cite: 10]
	}
)

func init() {
	loadStudentsFromFile("internal/data/students.json")
	initializeDefaultPolicies()
}

func initializeDefaultPolicies() {
	PolicyConfigMutex.Lock()
	defer PolicyConfigMutex.Unlock()

	// Set up a default configuration
	ActivePolicyConfig = models.PolicyConfig{
		MaximumCompanies: struct {
			Enabled bool `json:"enabled"`
			MaxN    int  `json:"maxN"`
		}{Enabled: true, MaxN: 5}, // Example: Max 5 companies
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
		}{Enabled: true, MinimumCGPA: 7.0, HighSalaryThreshold: 1200000}, // Example: Min CGPA 7.0, High Salary 12L
		PlacementPercentage: struct {
			Enabled          bool    `json:"enabled"`
			TargetPercentage float64 `json:"targetPercentage"`
		}{Enabled: false, TargetPercentage: 80}, // Example: Disabled, target 80%
		OfferCategory: struct {
			Enabled               bool    `json:"enabled"`
			L1ThresholdAmount     float64 `json:"l1ThresholdAmount"`
			L2ThresholdAmount     float64 `json:"l2ThresholdAmount"`
			RequiredHikePercentage float64 `json:"requiredHikePercentage"`
		}{Enabled: true, L1ThresholdAmount: 2000000, L2ThresholdAmount: 1000000, RequiredHikePercentage: 30}, // Example thresholds
	}
	log.Println("Default policy configuration initialized.")
}

func loadStudentsFromFile(filePathFromProjectRoot string) {
	wd, err := os.Getwd()
	if err != nil {
		log.Printf("Warning: Could not get current working directory: %v. Student data might not load.", err)
		Students = []models.Student{}
		return
	}

	absPath := filepath.Join(wd, filePathFromProjectRoot)

	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		altPath := filepath.Join(wd, "..", filePathFromProjectRoot)
		if _, err := os.Stat(altPath); err == nil {
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
}
