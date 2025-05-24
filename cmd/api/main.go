package main

import (
	"log"
	"net/http"

	"go-placement-policy/internal/api"
	"go-placement-policy/internal/models"
	"go-placement-policy/internal/storage"
)

func main() {
	// Initialize with a default policy configuration (all disabled)
	storage.ActivePolicyConfig = models.PolicyConfig{}

	// Define API routes
	http.HandleFunc("/policies/configure", api.ConfigurePoliciesHandler)
	http.HandleFunc("/policies", api.GetPoliciesHandler) // To retrieve current policies
	http.HandleFunc("/eligibility/check", api.CheckEligibilityHandler)

	port := ":8080"
	log.Printf("Server starting on port %s...\n", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 