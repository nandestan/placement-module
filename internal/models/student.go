package models

// Student represents the student data structure [cite: 8]
type Student struct {
	ID                     int  `json:"id"`
	FullName               string  `json:"name"`
	CGPA                   float64 `json:"cgpa"`
	IsPlaced               bool    `json:"isPlaced"`
	CurrentSalary          float64 `json:"currentSalary"`
	NumCompaniesApplied    int     `json:"companiesApplied"`
	DreamOfferAmount       float64 `json:"dreamOffer"`
	DreamCompanyName       string  `json:"dreamCompany"`
	// CurrentOfferCategory   string  `json:"currentOfferCategory"` // L1, L2, L3 derived from CurrentSalary and Policy
}
