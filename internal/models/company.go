package models

// Company represents the company data structure [cite: 9]
type Company struct {
	ID      string  `json:"id"`
	Name    string  `json:"name"`
	OfferedSalary float64 `json:"offeredSalary"`
}
