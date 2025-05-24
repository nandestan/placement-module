package storage

import (
	"sync"

	"go-placement-policy/internal/models"
)

// Global variable to store the active policies. In a real app, this would be persisted (e.g., in a database).
var (
	ActivePolicyConfig models.PolicyConfig
	// A mutex to protect access to ActivePolicyConfig from concurrent requests
	PolicyConfigMutex sync.RWMutex
	// Placeholder for student data (in a real app, this would be a database or a service)
	// For simplicity, let's initialize with some sample data.
	Students = map[string]models.Student{
		"S001": {
			ID:                "S001",
			FullName:          "Alice Smith",
			CGPA:              7.8,
			IsPlaced:          true,
			CurrentSalary:     800000,
			NumCompaniesApplied: 2,
			DreamOfferAmount:  1500000,
			DreamCompanyName:  "Tech Innovators",
			CurrentOfferCategory: "L3", // Assuming initial category
		},
		"S002": {
			ID:                "S002",
			FullName:          "Bob Johnson",
			CGPA:              6.2,
			IsPlaced:          false,
			CurrentSalary:     0,
			NumCompaniesApplied: 0,
			DreamOfferAmount:  1200000,
			DreamCompanyName:  "Global Corp",
			CurrentOfferCategory: "",
		},
		"S003": { // Sample for L2 placed student [cite: 10]
			ID:                "S003",
			FullName:          "Charlie Brown",
			CGPA:              8.5,
			IsPlaced:          true,
			CurrentSalary:     2500000, // 25L [cite: 10]
			NumCompaniesApplied: 2,
			DreamOfferAmount:  3500000,
			DreamCompanyName:  "Cyber Solutions",
			CurrentOfferCategory: "L2", // Assuming initial category
		},
	}
	// Placeholder for company data
	Companies = map[string]models.Company{
		"C001": {ID: "C001", Name: "Tech Innovators", OfferedSalary: 1500000}, // 15L [cite: 10]
		"C002": {ID: "C002", Name: "Global Corp", OfferedSalary: 1000000},
		"C003": {ID: "C003", Name: "Acme Corp", OfferedSalary: 3000000}, // 30L for L2 test case [cite: 10]
	}
)
