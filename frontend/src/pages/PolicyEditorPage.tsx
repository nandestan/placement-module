import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPolicies, updatePolicies } from '../api/policy'; // Ensure path is correct
import { PolicyConfig } from '../interfaces/policy';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PolicyForm from '../components/PolicyForm'; // Import the actual form

const PolicyEditorPage: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: currentPolicies, isLoading, isError, error } = useQuery<PolicyConfig, Error>({
        queryKey: ['policies'],
        queryFn: getPolicies,
    });

    const mutation = useMutation<PolicyConfig, Error, PolicyConfig>({
        mutationFn: updatePolicies,
        onSuccess: (data) => {
            queryClient.setQueryData(['policies'], data);
            alert('Policies updated successfully!');
        },
        onError: (error) => {
            alert(`Error updating policies: ${error.message}`);
        },
    });

    const handleSaveChanges = (updatedPolicies: PolicyConfig) => {
        mutation.mutate(updatedPolicies);
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ marginTop: 4 }}>
                <Alert severity="error">Error fetching policies: {error?.message}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom component="h1">
                    Policy Editor
                </Typography>
                {currentPolicies ? (
                    <PolicyForm
                        initialData={currentPolicies}
                        onSubmit={handleSaveChanges}
                        isSaving={mutation.isPending}
                    />
                ) : (
                    <Typography>No policies loaded.</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default PolicyEditorPage; 