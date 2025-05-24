package main

import (
	"log"
	"net/http"

	"go-placement-policy/internal/api"
	"go-placement-policy/internal/models"
	"go-placement-policy/internal/storage"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Initialize storage (which loads students.json and sets up ActivePolicyConfig)
	// The init() function in storage package handles this.
	// Ensure ActivePolicyConfig is initialized if not done by storage's init
	if storage.ActivePolicyConfig.MaximumCompanies.MaxN == 0 && !storage.ActivePolicyConfig.MaximumCompanies.Enabled {
		storage.ActivePolicyConfig = models.PolicyConfig{}
		log.Println("Initialized empty ActivePolicyConfig in main as it appeared to be zero-valued.")
	}

	router := chi.NewRouter()

	// CORS Middleware Configuration
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // React app's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any major browsers
	}))

	// Middleware
	router.Use(middleware.Logger)    // Log API requests
	router.Use(middleware.Recoverer) // Recover from panics without crashing server
	router.Use(middleware.Heartbeat("/ping")) // Adds a /ping endpoint for health checks

	// API routes
	router.Post("/policies/configure", api.ConfigurePoliciesHandler) // POST /policies/configure
	router.Get("/policies", api.GetPoliciesHandler)                 // GET /policies

	router.Route("/eligibility", func(r chi.Router) {
		r.Post("/check", api.CheckEligibilityHandler)
	})

	router.Route("/students", func(r chi.Router) {
		r.Get("/", api.GetAllStudentsHandler)         // GET /students
		r.Get("/{studentID}", api.GetStudentByIDHandler) // GET /students/123
	})

	router.Get("/companies", api.GetAllCompaniesHandler) // GET /companies

	port := ":8080"
	log.Printf("Server starting on port %s using chi router with CORS enabled...\n", port)
	err := http.ListenAndServe(port, router)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 