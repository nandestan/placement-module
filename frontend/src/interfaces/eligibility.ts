export interface EligibilityRequestPayload {
    studentId: number;
    companyId: string;
}

export interface EligibilityResult {
    studentId: number;
    companyId: string;
    isEligible: boolean;
    reasons: string[];
    policySpecifics?: string; // Optional based on omitempty
} 