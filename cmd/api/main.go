package main

import (
	"log"
	"net/http"

	"go-placement-policy/internal/api"
	"go-placement-policy/internal/storage"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// The init() function in the storage package handles loading student data from students.json
	// and initializing the ActivePolicyConfig with default values. 
	// This check is a safeguard: if ActivePolicyConfig appears uninitialized (e.g. zero-valued for MaxN 
	// and Enabled is false for MaximumCompanies policy), it logs a message and initializes to an empty config.
	// This situation should ideally not occur if storage.init() functions correctly.
	if storage.ActivePolicyConfig.MaximumCompanies.MaxN == 0 && !storage.ActivePolicyConfig.MaximumCompanies.Enabled {
		// This explicit initialization to an empty config might be too drastic if defaults are expected.
		// A better approach might be to call storage.initializeDefaultPolicies() if a zero-value is detected,
		// or rely solely on the init() in the storage package.
		// For now, logging this state is important for diagnostics.
		// storage.ActivePolicyConfig = models.PolicyConfig{} // Consider implications before re-enabling.
		log.Println("Warning: ActivePolicyConfig in main appeared to be zero-valued after storage init. This might indicate an issue with default policy loading.")
	}

	router := chi.NewRouter()

	// CORS Middleware Configuration to allow requests from the React frontend (localhost:3000).
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // React app's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Common HTTP methods
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"}, // Common headers
		ExposedHeaders:   []string{"Link"}, // Headers the client can access
		AllowCredentials: true, // Allows cookies to be sent
		MaxAge:           300,  // How long the result of a preflight request can be cached (in seconds)
	}))

	// Standard Chi middleware
	router.Use(middleware.Logger)    // Logs request details (method, path, duration, status)
	router.Use(middleware.Recoverer) // Gracefully handles panics and returns a 500 error
	router.Use(middleware.Heartbeat("/ping")) // Provides a /ping endpoint for health checks

	// An additional, simple heartbeat endpoint. /ping from middleware.Heartbeat is usually sufficient.
	router.Get("/heartbeat", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Alive"))
	})

	// API Route definitions
	// Policy related endpoints
	router.Get("/policies", api.GetPoliciesHandler)
	router.Post("/policies/configure", api.ConfigurePoliciesHandler)

	// Student related endpoints
	router.Get("/students", api.GetAllStudentsHandler)
	router.Get("/students/{studentID}", api.GetStudentByIDHandler)
	router.Post("/students", api.CreateStudentHandler)

	// Company related endpoints
	router.Get("/companies", api.GetAllCompaniesHandler)

	// Eligibility checking endpoints
	router.Post("/eligibility/check", api.CheckEligibilityHandler)
	router.Get("/eligibility/company/{companyID}/students", api.GetEligibleStudentsForCompanyHandler)

	port := ":8080"
	log.Printf("Server starting on port %s using chi router with CORS enabled...\n", port)
	err := http.ListenAndServe(port, router)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 