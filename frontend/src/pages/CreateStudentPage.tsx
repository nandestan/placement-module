import React, { useState } from 'react';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Alert,
    Snackbar,
    Box
} from '@mui/material';
import StudentForm, { StudentFormData } from '../components/StudentForm';
import { createStudent } from '../api/student';
import { Student } from '../interfaces/student';

// CreateStudentPage provides a form to add new students to the system.
const CreateStudentPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // For cache invalidation

    // State for managing Snackbar feedback messages
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // useMutation hook from TanStack Query to handle the student creation API call.
    const mutation = useMutation<Student, Error, StudentFormData>({
        mutationFn: createStudent, // The function that performs the asynchronous task (API call).
        onSuccess: (data: Student) => {
            // On successful creation:
            setSnackbarMessage(`Student "${data.name}" created successfully with ID: ${data.id}!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Invalidate the 'students' query cache to trigger a refetch on the student list page,
            // ensuring it displays the newly created student.
            queryClient.invalidateQueries({ queryKey: ['students'] });
            // Navigate to the student list page after a short delay to allow the user to see the success message.
            setTimeout(() => {
                navigate('/student-list');
            }, 2000);
        },
        onError: (error: Error) => {
            // On error, display an error message in the Snackbar.
            setSnackbarMessage(`Error creating student: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        },
    });

    // handleSubmit is called by the StudentForm upon valid form submission.
    // It triggers the mutation with the provided form data.
    const handleSubmit = (data: StudentFormData) => {
        mutation.mutate(data);
    };

    // handleSnackbarClose closes the Snackbar notification.
    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') { // Prevents Snackbar from closing on clicks away from it.
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md">
            {/* Example of a page title, currently commented out in favor of formTitle prop in StudentForm
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Create New Student
            </Typography> 
            */}
            <Box sx={{ my: 4 }}>
                <StudentForm
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending} // Pass loading state to the form for disabling submit button.
                    submitButtonText="Create Student"
                    formTitle="Create New Student" // Title is passed to StudentForm component.
                />
            </Box>
            {/* Snackbar for displaying success or error messages. */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateStudentPage; 