package models

// PolicyConfig represents the structure for all configurable policies
// This is a flexible design to enable/disable and store values for each policy.
type PolicyConfig struct {
	MaximumCompanies struct {
		Enabled bool `json:"enabled"`
		MaxN    int  `json:"maxN"` // 0 = no applications, N = max N applications [cite: 4]
	} `json:"maximumCompanies"`
	DreamOffer struct {
		Enabled bool `json:"enabled"`
	} `json:"dreamOffer"` // Students declare individual dream offer amounts [cite: 5]
	DreamCompany struct {
		Enabled bool `json:"enabled"`
	} `json:"dreamCompany"` // Students declare individual dream companies [cite: 5]
	CGPAThreshold struct {
		Enabled           bool    `json:"enabled"`
		MinimumCGPA       float64 `json:"minimumCGPA"`      // 0.0-10.0 [cite: 5]
		HighSalaryThreshold float64 `json:"highSalaryThreshold"` // High-salary threshold amount [cite: 5]
	} `json:"cgpaThreshold"`
	PlacementPercentage struct {
		Enabled          bool    `json:"enabled"`
		TargetPercentage float64 `json:"targetPercentage"` // 0-100% [cite: 6]
	} `json:"placementPercentage"`
	OfferCategory struct {
		Enabled               bool    `json:"enabled"`
		L1ThresholdAmount     float64 `json:"l1ThresholdAmount"`     // highest tier [cite: 6]
		L2ThresholdAmount     float64 `json:"l2ThresholdAmount"`     // middle tier [cite: 6]
		RequiredHikePercentage float64 `json:"requiredHikePercentage"` // for L2 students [cite: 6]
	} `json:"offerCategory"`
}

// EligibilityResult represents the output for each student [cite: 10]
type EligibilityResult struct {
	StudentID       int      `json:"studentId"`
	CompanyID       string   `json:"companyId"`
	IsEligible      bool     `json:"isEligible"`
	Reasons         []string `json:"reasons"` // List of reasons supporting the decision [cite: 10]
	PolicySpecifics string   `json:"policySpecifics,omitempty"` // Policy-specific details where applicable [cite: 10]
}
