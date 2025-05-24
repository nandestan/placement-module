package eligibility

import (
	"fmt"

	"go-placement-policy/internal/models"
	"go-placement-policy/internal/storage"
)

// performEligibilityCheck applies all active policies to determine eligibility.
// This is where your core policy enforcement logic goes.
func PerformEligibilityCheck(student models.Student, company models.Company) models.EligibilityResult {
	result := models.EligibilityResult{
		StudentID:  student.ID,
		CompanyID:  company.ID,
		IsEligible: true, // Assume eligible until a policy blocks
		Reasons:    []string{},
	}

	// Acquire a read lock on the policy configuration
	storage.PolicyConfigMutex.RLock()
	config := storage.ActivePolicyConfig
	storage.PolicyConfigMutex.RUnlock()

	// 1. Check if student is placed or unplaced [cite: 9]
	// Policies primarily affect 'placed' students applying for 'additional companies' [cite: 4, 6]

	// If unplaced, they are generally eligible unless specific policies restrict (e.g., global CGPA for all applications, not just high-paying)
	// For this system's current scope, unplaced students are generally eligible unless they are blocked by a CGPA policy for *any* application.
	// Since CGPA is tied to 'high-paying positions'[cite: 5], an unplaced student might still be eligible for standard positions.
	// We'll focus on 'placed' student restrictions first as per document emphasis.

	if student.IsPlaced {
		// Apply all active policies in sequence [cite: 9]

		// 2.1.1 Maximum Companies Policy [cite: 4]
		if config.MaximumCompanies.Enabled {
			if config.MaximumCompanies.MaxN == 0 && student.IsPlaced { // If set to 0, placed students cannot apply to any additional companies [cite: 4]
				result.IsEligible = false
				result.Reasons = append(result.Reasons, "Blocked by Maximum Companies Policy: Already placed and 0 additional applications allowed.")
			} else if student.NumCompaniesApplied >= config.MaximumCompanies.MaxN {
				result.IsEligible = false
				result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Maximum Companies Policy: Already applied to %d companies, max allowed is %d.", student.NumCompaniesApplied, config.MaximumCompanies.MaxN))
			}
		}

		// 2.1.6 Offer Category Policy (L1/L2 placed students) [cite: 6, 7]
		// This policy has high priority as L1 students cannot apply to ANY other companies.
		// L2 students have specific hike requirements.
		if config.OfferCategory.Enabled {
			// First, determine student's category based on current salary and policy thresholds
			var category string
			if student.CurrentSalary >= config.OfferCategory.L1ThresholdAmount {
				category = "L1"
			} else if student.CurrentSalary >= config.OfferCategory.L2ThresholdAmount {
				category = "L2"
			} else {
				category = "L3" // L3 below L2 threshold [cite: 6]
			}
			// student.CurrentOfferCategory = category // Update student's internal category for logic below

			if category == "L1" { // L1 placed students: Cannot apply to any other companies [cite: 7]
				result.IsEligible = false
				result.Reasons = append(result.Reasons, "Blocked by Offer Category Policy: L1 placed students cannot apply to any other companies.")
			} else if category == "L2" { // L2 placed students: Can apply only to companies offering >= X% hike over current salary [cite: 7]
				requiredHikeAmount := student.CurrentSalary * (config.OfferCategory.RequiredHikePercentage / 100.0)
				if company.OfferedSalary < (student.CurrentSalary + requiredHikeAmount) {
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Offer Category Policy (L2): Company salary (%.2f) does not meet required hike (%.2f%% over current salary %.2f).", company.OfferedSalary, config.OfferCategory.RequiredHikePercentage, student.CurrentSalary))
				}
			}
			// L3 placed students: Can apply based on other active policies [cite: 7]
			// No direct blocking rule here, other policies will apply.
		}

		// 2.1.2 Dream Offer Policy [cite: 5]
		if config.DreamOffer.Enabled {
			// Business Rule: Placed students can apply only if company salary >= student's dream offer [cite: 5]
			if company.OfferedSalary < student.DreamOfferAmount {
				// If this policy is enabled and the offer is less than dream offer, but *not* blocked by another policy,
				// it's a potential block. However, Dream Company policy can override.
				// For now, if blocked, add reason.
				if result.IsEligible { // Only block if not already blocked by a higher priority policy
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Dream Offer Policy: Company salary (%.2f) is less than student's dream offer (%.2f).", company.OfferedSalary, student.DreamOfferAmount))
				}
			} else {
				// If it *meets* the dream offer, it could be a reason for eligibility
				result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Offer Policy: Company salary (%.2f) meets or exceeds student's dream offer (%.2f).", company.OfferedSalary, student.DreamOfferAmount))
			}
		}

		// 2.1.3 Dream Company Policy [cite: 5]
		if config.DreamCompany.Enabled {
			// Business Rule: Placed students can apply to their dream company even if other policies would block them [cite: 5]
			if company.Name == student.DreamCompanyName {
				if !result.IsEligible { // If previously blocked by another policy, this policy overrides.
					result.IsEligible = true
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Company Policy: %s is student's declared dream company.", company.Name))
					// You might want to clear other blocking reasons here or mark them as "overridden".
				} else {
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Dream Company Policy: %s is student's declared dream company.", company.Name))
				}
			}
		}

		// 2.1.4 CGPA Threshold Policy [cite: 5]
		if config.CGPAThreshold.Enabled {
			// Business Rule: Students can apply for companies offering above threshold salary only if their CGPA >= minimum requirement [cite: 5]
			if company.OfferedSalary >= config.CGPAThreshold.HighSalaryThreshold {
				if student.CGPA < config.CGPAThreshold.MinimumCGPA {
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by CGPA Threshold Policy: CGPA (%.2f) is below minimum (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				} else {
					result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by CGPA Threshold Policy: CGPA (%.2f) meets requirement (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				}
			}
		}

		// 2.1.5 Placement Percentage Policy [cite: 6]
		if config.PlacementPercentage.Enabled {
			// This needs overall placement data, which is not readily available in 'student' or 'company'
			// For a complete implementation, you'd need to fetch total students and placed students count.
			// Placeholder: Assume total students = 100 for a simplified example
			totalStudents := 100 // This should come from a database or a statistics service
			placedStudents := 0
			for _, s := range storage.Students { // Corrected to use storage.Students
				if s.IsPlaced {
					placedStudents++
				}
			}

			currentPlacementPercentage := (float64(placedStudents) / float64(totalStudents)) * 100

			// Business Rule: Placed students cannot apply until (placed students / total students) * 100 >= target percentage [cite: 6]
			if currentPlacementPercentage < config.PlacementPercentage.TargetPercentage {
				result.IsEligible = false
				result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by Placement Percentage Policy: Current overall placement (%.2f%%) is below target (%.2f%%).", currentPlacementPercentage, config.PlacementPercentage.TargetPercentage))
			} else {
				result.Reasons = append(result.Reasons, fmt.Sprintf("Allowed by Placement Percentage Policy: Current overall placement (%.2f%%) meets or exceeds target (%.2f%%).", currentPlacementPercentage, config.PlacementPercentage.TargetPercentage))
			}
		}

	} else {
		// If unplaced, they are generally eligible unless specific universal rules apply (e.g., if a CGPA policy was for ALL applications, not just high-paying ones).
		// Based on the document, most policies apply to 'placed' students for 'additional companies' or 'high-paying positions'.
		// For an unplaced student, the primary blocking policy could be CGPA if the company offers a high salary.
		if config.CGPAThreshold.Enabled {
			if company.OfferedSalary >= config.CGPAThreshold.HighSalaryThreshold {
				if student.CGPA < config.CGPAThreshold.MinimumCGPA {
					result.IsEligible = false
					result.Reasons = append(result.Reasons, fmt.Sprintf("Blocked by CGPA Threshold Policy: CGPA (%.2f) is below minimum (%.2f) for high-paying offer (%.2f).", student.CGPA, config.CGPAThreshold.MinimumCGPA, company.OfferedSalary))
				}
			}
		}

		if result.IsEligible {
			result.Reasons = append(result.Reasons, "Student is unplaced and no active policies block the application.")
		}
	}

	// Handle policy conflicts intelligently [cite: 9]
	// The order of applying policies above implicitly handles some conflicts (e.g., Dream Company overriding).
	// For more complex conflicts, you might need a more sophisticated decision tree or priority system.
	// For now, if any blocking reason exists and Dream Company policy didn't override, then result is false.
	// If it was set to true initially and no blocking policies were hit, it remains true.

	if len(result.Reasons) == 0 {
		result.Reasons = append(result.Reasons, "No active policies apply or block this application.")
	}

	return result
}
