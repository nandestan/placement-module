export interface EligibilityRequestPayload {
    studentId: number;
    companyId: string;
}

export interface EligibilityResult {
    studentId: number;
    studentName: string;
    companyId: string;
    companyName: string;
    isEligible: boolean;
    reasons: string[];
    policySpecifics?: string;
} 