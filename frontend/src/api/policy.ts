import axios from 'axios';
import { PolicyConfig } from '../interfaces/policy'; // Ensure path is correct

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetches the current policy configuration.
 */
export const getPolicies = async (): Promise<PolicyConfig> => {
    const response = await apiClient.get<PolicyConfig>('/policies');
    return response.data;
};

/**
 * Updates the policy configuration.
 * @param config The new policy configuration.
 */
export const updatePolicies = async (config: PolicyConfig): Promise<PolicyConfig> => {
    const response = await apiClient.post<PolicyConfig>('/policies/configure', config);
    return response.data;
};
