import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { checkStudentEligibility } from '../api/eligibility';
import { EligibilityRequestPayload, EligibilityResult } from '../interfaces/eligibility';
import { getStudents } from '../api/student'; // For student dropdown
import { Student } from '../interfaces/student';    // For student dropdown
import { getCompanies } from '../api/company';  // For company dropdown
import { Company } from '../interfaces/company';    // For company dropdown
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';


const EligibilityCheckerPage: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string>(''); // Store as string for Select
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(''); // Store as string for Select
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

    // Fetch students for dropdown
    const { data: students, isLoading: isLoadingStudents, isError: isErrorStudents, error: errorStudents } = useQuery<Student[], Error>({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    // Fetch companies for dropdown
    const { data: companies, isLoading: isLoadingCompanies, isError: isErrorCompanies, error: errorCompanies } = useQuery<Company[], Error>({
        queryKey: ['companies'],
        queryFn: getCompanies,
    });

    const mutation = useMutation<EligibilityResult, Error, EligibilityRequestPayload>({
        mutationFn: checkStudentEligibility,
        onSuccess: (data) => {
            setEligibilityResult(data);
        },
        onError: (error) => {
            setEligibilityResult(null);
            console.error("Error checking eligibility:", error);
        },
    });

    const handleStudentChange = (event: SelectChangeEvent<string>) => {
        setSelectedStudentId(event.target.value);
        setEligibilityResult(null); // Clear previous results when selection changes
    };

    const handleCompanyChange = (event: SelectChangeEvent<string>) => {
        setSelectedCompanyId(event.target.value);
        setEligibilityResult(null); // Clear previous results when selection changes
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const studentIdNum = parseInt(selectedStudentId, 10);

        if (isNaN(studentIdNum) || selectedStudentId === '') {
            alert('Please select a student.');
            return;
        }
        if (selectedCompanyId === '') {
            alert('Please select a company.');
            return;
        }
        mutation.mutate({ studentId: studentIdNum, companyId: selectedCompanyId });
    };

    if (isLoadingStudents || isLoadingCompanies) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading selection data...</Typography>
            </Container>
        );
    }


    return (
        <Container sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom component="h1">
                    Check Student Eligibility
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth margin="normal" required disabled={isLoadingStudents || isErrorStudents}>
                                <InputLabel id="student-select-label">Student</InputLabel>
                                <Select
                                    labelId="student-select-label"
                                    id="student-select"
                                    value={selectedStudentId}
                                    label="Student"
                                    onChange={handleStudentChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select a student</em>
                                    </MenuItem>
                                    {isErrorStudents && <MenuItem disabled>Error loading students</MenuItem>}
                                    {students?.map((student) => (
                                        <MenuItem key={student.id} value={String(student.id)}>
                                            {student.name} (ID: {student.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth margin="normal" required disabled={isLoadingCompanies || isErrorCompanies}>
                                <InputLabel id="company-select-label">Company</InputLabel>
                                <Select
                                    labelId="company-select-label"
                                    id="company-select"
                                    value={selectedCompanyId}
                                    label="Company"
                                    onChange={handleCompanyChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select a company</em>
                                    </MenuItem>
                                    {isErrorCompanies && <MenuItem disabled>Error loading companies</MenuItem>}
                                    {companies?.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.name} (ID: {company.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={mutation.isPending || !selectedStudentId || !selectedCompanyId}
                    >
                        {mutation.isPending ? <CircularProgress size={24} /> : 'Check Eligibility'}
                    </Button>
                </Box>

                {mutation.isError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Error checking eligibility: {mutation.error?.message || 'An unknown error occurred.'}
                    </Alert>
                )}

                {eligibilityResult && (
                    <Paper elevation={1} sx={{ padding: 2, marginTop: 3, backgroundColor: eligibilityResult.isEligible ? '#e8f5e9' : '#ffebee' }}>
                        <Typography variant="h5" gutterBottom component="h2">
                            Eligibility Result
                        </Typography>
                        <Typography variant="subtitle1" color={eligibilityResult.isEligible ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                            Student is {eligibilityResult.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            For Student : {eligibilityResult.studentName} (ID: {eligibilityResult.studentId})<br />
                            For Company : {eligibilityResult.companyName} (ID: {eligibilityResult.companyId})
                        </Typography>

                        {eligibilityResult.reasons && eligibilityResult.reasons.length > 0 && (
                            <>
                                <Typography variant="h6" sx={{ mt: 2, fontSize: '1.1rem' }}>Reasons:</Typography>
                                <List dense sx={{ pl: 2 }}>
                                    {eligibilityResult.reasons.map((reason, index) => (
                                        <ListItem key={index} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <ListItemText primary={`- ${reason}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                        {eligibilityResult.policySpecifics && (
                            <>
                                <Typography variant="h6" sx={{ mt: 2, fontSize: '1.1rem' }}>Policy Specifics:</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap', pl: 2 }}>{eligibilityResult.policySpecifics}</Typography>
                            </>
                        )}
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default EligibilityCheckerPage; 