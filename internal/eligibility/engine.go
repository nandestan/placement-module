package eligibility

import (
	"fmt"

	"go-placement-policy/internal/models"
	"go-placement-policy/internal/storage"
)

// PerformEligibilityCheck evaluates a student's eligibility for a specific company based on active placement policies.
// It initializes an EligibilityResult and then sequentially applies various policy checks.
// The order of policy application can matter, especially for overriding policies like DreamCompany.
func PerformEligibilityCheck(student models.Student, company models.Company) models.EligibilityResult {
	result := models.EligibilityResult{
		StudentID:   student.ID,
		StudentName: student.FullName,
		CompanyID:   company.ID,
		CompanyName: company.Name,
		IsEligible:  true, // Assume eligible until a policy blocks
		Reasons:     []string{},
	}

	storage.PolicyConfigMutex.RLock()
	config := storage.ActivePolicyConfig
	storage.PolicyConfigMutex.RUnlock()

	// General approach: Policies primarily target 'placed' students seeking additional opportunities.
	// Unplaced students are generally eligible unless a specific policy (like a global CGPA minimum for all offers)
	// explicitly blocks them. Currently, CGPA checks are tied to high-salary positions.
	if student.IsPlaced {
		// Maximum Companies Policy: Limits how many companies a placed student can apply to.
		if config.MaximumCompanies.Enabled {
			if config.MaximumCompanies.MaxN == 0 { // Special case: MaxN = 0 means no more applications if already placed.
				result.IsEligible = false
				result.Reasons = append(result.Reasons, "Blocked by Maximum Companies Policy: Already placed and 0 additional applications allowed.")
			} else if student.NumCompaniesApplied >= config.MaximumCompanies.MaxN {
				result.IsEligible = false
				result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Maximum Companies Policy: Already applied to %d companies, max allowed is %d.", student.NumCompaniesApplied, config.MaximumCompanies.MaxN))
			}
		}

		// Offer Category Policy: Restricts applications based on the student's current offer category (L1, L2, L3).
		if config.OfferCategory.Enabled {
			var category string
			if student.CurrentSalary >= config.OfferCategory.L1ThresholdAmount {
				category = "L1"
			} else if student.CurrentSalary >= config.OfferCategory.L2ThresholdAmount {
				category = "L2"
			} else {
				category = "L3" // Student with offer below L2 threshold or no offer (if IsPlaced is true without salary, though unlikely)
			}

			if category == "L1" { // L1 placed students typically cannot apply further.
				result.IsEligible = false
				result.Reasons = append(result.Reasons, "Blocked by Offer Category Policy: L1 placed students cannot apply to any other companies.")
			} else if category == "L2" { // L2 placed students need a significant hike to apply for other companies.
				requiredHikeAmount := student.CurrentSalary * (config.OfferCategory.RequiredHikePercentage / 100.0)
				if company.OfferedSalary < (student.CurrentSalary + requiredHikeAmount) {
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Offer Category Policy (L2): Company salary (%.2f) does not meet required hike (%.2f%% over current salary %.2f).", company.OfferedSalary, config.OfferCategory.RequiredHikePercentage, student.CurrentSalary))
				}
			}
		}

		// Dream Offer Policy: Checks if the company's offer meets the student's declared dream offer amount.
		// This policy can block an otherwise eligible application if the offer is too low.
		if config.DreamOffer.Enabled {
			if company.OfferedSalary < student.DreamOfferAmount {
				// Only block if they were eligible before this check.
				// If already ineligible, this policy doesn't make them more ineligible, but the reason isn't added unless they were eligible.
				if result.IsEligible { 
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Dream Offer Policy: Company salary (%.2f) is less than student's dream offer (%.2f).", company.OfferedSalary, student.DreamOfferAmount))
				}
			} else {
				// If the offer meets/exceeds the dream amount, it can be an allowing reason, or support existing eligibility.
				result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Offer Policy: Company salary (%.2f) meets or exceeds student's dream offer (%.2f).", company.OfferedSalary, student.DreamOfferAmount))
			}
		}

		// Dream Company Policy: Allows a student to apply to their declared dream company, potentially overriding other blocking policies.
		if config.DreamCompany.Enabled {
			// Business Rule: Placed students can apply to their dream company even if other policies would block them.
			if company.Name == student.DreamCompanyName {
				if !result.IsEligible { // If previously blocked by another policy, this dream company policy overrides.
					result.IsEligible = true
					result.Reasons = []string{} // Clear previous blocking reasons as this is an override.
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Company Policy: %s is student's declared dream company.", company.Name))
				} else {
					// If already eligible, add this as a supporting reason.
					// For simplicity, we'll add it. Deduplication of reasons can be handled later if necessary.
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Company Policy: %s is student's declared dream company (already eligible).", company.Name))
				}
			}
		}

		// CGPA Threshold Policy: Checks if student's CGPA meets minimum for high-salary offers.
		if config.CGPAThreshold.Enabled {
			if company.OfferedSalary >= config.CGPAThreshold.HighSalaryThreshold {
				if student.CGPA < config.CGPAThreshold.MinimumCGPA {
					// This can make a student ineligible, even if Dream Company policy made them eligible.
					// The order of policies matters. If CGPA is a hard block regardless of dream status, this logic is correct.
					// If Dream Company should override CGPA too, this block might need to be conditional on !isDreamCompanyApplication.
					result.IsEligible = false 
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by CGPA Threshold Policy: CGPA (%.2f) is below minimum (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				} else {
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by CGPA Threshold Policy: CGPA (%.2f) meets requirement (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				}
			}
		}

		// Placement Percentage Policy: Restricts placed students from applying if overall placement percentage is below target.
		if config.PlacementPercentage.Enabled {
			storage.PlacementStatsMutex.RLock()
			totalStudents := storage.CachedTotalStudents
			placedStudents := storage.CachedPlacedStudentsCount
			storage.PlacementStatsMutex.RUnlock()

			var currentPlacementPercentage float64
			if totalStudents > 0 {
				currentPlacementPercentage = (float64(placedStudents) / float64(totalStudents)) * 100
			} else {
				currentPlacementPercentage = 0 // Avoid division by zero if there are no students.
			}

			// Business Rule: Placed students cannot apply until overall campus placement meets target percentage.
			if currentPlacementPercentage < config.PlacementPercentage.TargetPercentage {
				result.IsEligible = false
				result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Placement Percentage Policy: Current overall placement (%.2f%%) is below target (%.2f%%).", currentPlacementPercentage, config.PlacementPercentage.TargetPercentage))
			} else {
				result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Placement Percentage Policy: Current overall placement (%.2f%%) meets or exceeds target (%.2f%%).", currentPlacementPercentage, config.PlacementPercentage.TargetPercentage))
			}
		}

	} else { // Logic for unplaced students
		// Unplaced students are generally less restricted. Only certain policies like CGPA for high-value offers apply.
		if config.CGPAThreshold.Enabled {
			if company.OfferedSalary >= config.CGPAThreshold.HighSalaryThreshold {
				if student.CGPA < config.CGPAThreshold.MinimumCGPA {
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by CGPA Threshold Policy: CGPA (%.2f) is below minimum (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				}
			}
		}

		if result.IsEligible {
			result.Reasons = append(result.Reasons, "Student is unplaced. No active policies currently block this application.")
		}
	}

	// If no specific reasons were added (e.g., unplaced student, no blocking/allowing policies triggered, or all policies disabled)
	// provide a generic message.
	if len(result.Reasons) == 0 && result.IsEligible {
		result.Reasons = append(result.Reasons, "No active policies specifically allow or block this application; student meets general eligibility.")
	} else if len(result.Reasons) == 0 && !result.IsEligible {
		// This case should ideally not happen if IsEligible is false, as a reason should have been added.
		// Adding a fallback reason.
		result.Reasons = append(result.Reasons, "Blocked by an unspecified policy configuration.")
	}

	return result
}
