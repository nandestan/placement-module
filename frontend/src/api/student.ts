import axios from 'axios';
import { Student } from '../interfaces/student'; // Assuming you have this interface

const axiosService = axios.create({
    baseURL: 'http://localhost:8080', // Your Go API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStudents = async (): Promise<Student[]> => {
    const response = await axiosService.get<Student[]>('/students');
    return response.data;
};

export const getStudentById = async (id: number): Promise<Student> => {
    const response = await axiosService.get<Student>(`/students/${id}`);
    return response.data;
};

// You can add more API functions here for policies, eligibility checks, etc.
// For example:
// interface EligibilityRequest {
//   studentId: number;
//   companyId: string;
// }
// interface EligibilityResult { // Define this based on your Go model
//   studentId: number;
//   companyId: string;
//   isEligible: boolean;
//   reasons: string[];
//   policySpecifics?: string;
// }
// export const checkEligibility = async (payload: EligibilityRequest): Promise<EligibilityResult> => {
//   const response = await apiClient.post<EligibilityResult>('/eligibility/check', payload);
//   return response.data;
// };