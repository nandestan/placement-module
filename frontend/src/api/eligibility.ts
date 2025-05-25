import axios from 'axios';
import { EligibilityRequestPayload, EligibilityResult } from '../interfaces/eligibility';
import { Student } from '../interfaces/student';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Your Go API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkStudentEligibility = async (payload: EligibilityRequestPayload): Promise<EligibilityResult> => {
    const response = await apiClient.post<EligibilityResult>('/eligibility/check', payload);
    return response.data;
};

export const getEligibleStudentsForCompany = async (companyId: string): Promise<Student[]> => {
    if (!companyId) {
        return Promise.resolve([]); // Return empty array if no companyId is provided
    }
    const response = await apiClient.get<Student[]>(`/eligibility/company/${companyId}/students`);
    return response.data;
}; 