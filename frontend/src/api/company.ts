import axios from 'axios';
import { Company } from '../interfaces/company'; // Ensure path is correct

const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Your Go API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCompanies = async (): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>('/companies');
    return response.data;
}; 