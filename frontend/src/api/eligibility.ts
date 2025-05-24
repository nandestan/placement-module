import axios from 'axios';
import { EligibilityRequestPayload, EligibilityResult } from '../interfaces/eligibility';

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