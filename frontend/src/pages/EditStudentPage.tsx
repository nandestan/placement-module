import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Alert,
    Snackbar,
    Box,
    CircularProgress
} from '@mui/material';
import StudentForm, { StudentFormData } from '../components/StudentForm';
import { getStudentById, updateStudent } from '../api/student';
import { Student } from '../interfaces/student';

const EditStudentPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const studentId = parseInt(id || '');

    const { data: student, isLoading: isLoadingStudent, isError: isErrorStudent, error: studentError } = useQuery<Student, Error>({
        queryKey: ['student', studentId],
        queryFn: () => getStudentById(studentId),
        enabled: !!studentId, // Only run query if studentId is valid
    });

    const mutation = useMutation<Student, Error, { id: number; data: StudentFormData }>({
        mutationFn: (params) => updateStudent(params.id, params.data),
        onSuccess: (data: Student) => {
            setSnackbarMessage(`Student "${data.name}" updated successfully!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            queryClient.invalidateQueries({ queryKey: ['students'] }); // Invalidate list
            queryClient.invalidateQueries({ queryKey: ['student', data.id] }); // Invalidate this student's cache
            setTimeout(() => {
                navigate('/student-list');
            }, 2000);
        },
        onError: (error: Error) => {
            setSnackbarMessage(`Error updating student: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        },
    });

    const handleSubmit = (data: StudentFormData) => {
        if (studentId) {
            mutation.mutate({ id: studentId, data });
        }
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    if (isLoadingStudent) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isErrorStudent || !student) {
        return <Alert severity="error">Error fetching student details: {studentError?.message || 'Student not found'}</Alert>;
    }

    // Prepare initial form data from the fetched student object
    // Ensure all fields expected by StudentFormData are covered, even if undefined initially
    const initialFormData: StudentFormData = {
        name: student.name,
        cgpa: student.cgpa,
        dreamOffer: student.dreamOffer,
        dreamCompany: student.dreamCompany || '', // Handle potentially undefined dreamCompany
        companiesApplied: student.companiesApplied,
        isPlaced: student.isPlaced,
        currentSalary: student.currentSalary,
        // Add any other fields that StudentForm expects
    };


    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <StudentForm
                    defaultValues={initialFormData}
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending}
                    submitButtonText="Update Student"
                    formTitle="Edit Student Details"
                />
            </Box>
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

export default EditStudentPage; 