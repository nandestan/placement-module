import React from 'react';
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import {
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Box,
    Paper,
    Typography
} from '@mui/material';
import { Student } from '../interfaces/student';

// StudentFormData represents the shape of the data handled by this form, excluding the student ID.
export type StudentFormData = Omit<Student, 'id'>;

interface StudentFormProps {
    onSubmit: SubmitHandler<StudentFormData>; // Function to call when the form is submitted with valid data.
    defaultValues?: Partial<StudentFormData>;  // Optional initial values for the form fields.
    isSubmitting?: boolean;                    // Flag to indicate if the form is currently being submitted.
    submitButtonText?: string;                 // Text for the submit button.
    formTitle?: string;                        // Title displayed above the form.
}

// StudentForm is a reusable component for creating or editing student data.
// It uses react-hook-form for form handling and validation, and Material-UI components for layout.
const StudentForm: React.FC<StudentFormProps> = ({
    onSubmit,
    defaultValues,
    isSubmitting = false,
    submitButtonText = "Submit",
    formTitle = "Student Form"
}) => {
    const {
        control, // react-hook-form controller for integrating MUI components.
        handleSubmit, // react-hook-form function to handle form submission after validation.
        formState: { errors }, // Object containing form validation errors.
        reset, // Function to reset form fields.
        watch // Function to watch form field values.
    } = useForm<StudentFormData>({
        defaultValues: defaultValues || {
            name: '',
            cgpa: undefined, // Initialize number fields as undefined for controlled inputs and proper parsing.
            isPlaced: false,
            currentSalary: undefined,
            companiesApplied: undefined,
            dreamOffer: undefined,
            dreamCompany: '',
        },
    });

    // Watch the 'isPlaced' field to conditionally show/require the 'currentSalary' field.
    const isPlacedValue = watch('isPlaced');

    // handleFormSubmit processes the form data before calling the parent onSubmit handler.
    // It ensures that numeric fields are correctly parsed from string inputs and defaults undefined numbers to 0.
    const handleFormSubmit: SubmitHandler<StudentFormData> = (data: StudentFormData) => {
        const numericData = {
            ...data,
            cgpa: data.cgpa !== undefined ? parseFloat(String(data.cgpa)) : 0.0,
            currentSalary: data.isPlaced && data.currentSalary !== undefined ? parseFloat(String(data.currentSalary)) : 0.0,
            companiesApplied: data.companiesApplied !== undefined ? parseInt(String(data.companiesApplied), 10) : 0,
            dreamOffer: data.dreamOffer !== undefined ? parseFloat(String(data.dreamOffer)) : 0.0,
        };
        onSubmit(numericData);
        // Optionally, reset the form after successful submission:
        // reset(); 
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
                {formTitle}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <Grid container spacing={2}>
                    {/* Full Name Field */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Full name is required' }}
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* CGPA Field */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="cgpa"
                            control={control}
                            rules={{
                                required: 'CGPA is required',
                                min: { value: 0, message: 'CGPA cannot be negative' },
                                max: { value: 10, message: 'CGPA cannot exceed 10' },
                                // Validate that the value is either empty/undefined or a valid number.
                                validate: (value: any) => value === undefined || value === '' || !isNaN(parseFloat(String(value))) || 'Invalid CGPA format'
                            }}
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="CGPA"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    required
                                    error={!!errors.cgpa}
                                    helperText={errors.cgpa?.message}
                                    inputProps={{ step: "0.01" }}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* Companies Applied To Field */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="companiesApplied"
                            control={control}
                            rules={{
                                required: 'Number of companies applied is required',
                                min: { value: 0, message: 'Cannot be negative' },
                                validate: (value: any) => value === undefined || value === '' || !isNaN(parseInt(String(value), 10)) || 'Invalid number'
                            }}
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="Companies Applied To"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    required
                                    error={!!errors.companiesApplied}
                                    helperText={errors.companiesApplied?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* Dream Offer Amount Field */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="dreamOffer"
                            control={control}
                            rules={{
                                required: 'Dream Offer Amount is required',
                                min: { value: 0, message: 'Cannot be negative' },
                                validate: (value: any) => value === undefined || value === '' || !isNaN(parseFloat(String(value))) || 'Invalid amount'
                            }}
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="Dream Offer Amount"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    required
                                    error={!!errors.dreamOffer}
                                    helperText={errors.dreamOffer?.message}
                                    inputProps={{ step: "0.01" }}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* Dream Company Name Field */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="dreamCompany"
                            control={control}
                            defaultValue=""
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="Dream Company Name (Optional)"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.dreamCompany}
                                    helperText={errors.dreamCompany?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* Is Placed? Switch */}
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Controller
                            name="isPlaced"
                            control={control}
                            defaultValue={false}
                            render={({ field }: { field: FieldValues }) => (
                                <FormControlLabel
                                    control={<Switch {...field} checked={field.value || false} />}
                                    label="Is Placed?"
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    </Grid>
                    {/* Current Salary Field (Conditional) */}
                    {isPlacedValue && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="currentSalary"
                                control={control}
                                rules={{
                                    required: isPlacedValue ? 'Current Salary is required if placed' : false,
                                    min: { value: 0, message: 'Salary cannot be negative' },
                                    // Validate only if student is placed and value is not empty/undefined.
                                    validate: (value: any) => !isPlacedValue || value === undefined || value === '' || !isNaN(parseFloat(String(value))) || 'Invalid salary format'
                                }}
                                defaultValue={undefined}
                                render={({ field }: { field: FieldValues }) => (
                                    <TextField
                                        {...field}
                                        label="Current Salary"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        required={isPlacedValue} // Conditionally require based on 'isPlaced' status.
                                        error={!!errors.currentSalary}
                                        helperText={errors.currentSalary?.message}
                                        inputProps={{ step: "0.01" }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                        </Grid>
                    )}
                </Grid>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : submitButtonText}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default StudentForm; 