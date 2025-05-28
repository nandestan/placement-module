import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { checkStudentEligibility, getEligibleStudentsForCompany } from '../api/eligibility';
import { EligibilityRequestPayload, EligibilityResult } from '../interfaces/eligibility';
import { getStudents } from '../api/student';
import { Student } from '../interfaces/student';
import { getCompanies } from '../api/company';
import { Company } from '../interfaces/company';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { formatToINR } from '../utils/formatting';

const EligibilityCheckerPage: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

    const { data: students, isLoading: isLoadingStudents, isError: isErrorStudents } = useQuery<Student[], Error>({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    const { data: companies, isLoading: isLoadingCompanies, isError: isErrorCompanies } = useQuery<Company[], Error>({
        queryKey: ['companies'],
        queryFn: getCompanies,
    });

    // Query to fetch eligible students when a company is selected
    const {
        data: eligibleStudentsForCompany,
        isLoading: isLoadingEligibleStudents,
        isError: isErrorEligibleStudents,
        error: errorEligibleStudents,
        refetch: refetchEligibleStudents
    } = useQuery<Student[], Error>({
        queryKey: ['eligibleStudentsForCompany', selectedCompanyId],
        queryFn: () => getEligibleStudentsForCompany(selectedCompanyId),
        enabled: !!selectedCompanyId,
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
        setEligibilityResult(null);
    };

    const handleCompanyChange = (event: SelectChangeEvent<string>) => {
        setSelectedCompanyId(event.target.value);
        setEligibilityResult(null);
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
            <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
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
                            Eligibility Result for Selected Student & Company
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
                        {/* PolicySpecifics might not be relevant for a general list, removed for brevity in this section */}
                    </Paper>
                )}
            </Paper>

            {/* Display list of eligible students for the selected company */}
            {selectedCompanyId && (
                <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                    <Typography variant="h5" gutterBottom component="h2">
                        Eligible Students for: {companies?.find(c => c.id === selectedCompanyId)?.name || 'Selected Company'}
                        {/* Display offered salary of the selected company, formatted to INR */}
                        {companies?.find(c => c.id === selectedCompanyId)?.offeredSalary !== undefined && (
                            <Typography variant="subtitle1" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                (Offered Salary: {formatToINR(companies?.find(c => c.id === selectedCompanyId)?.offeredSalary)})
                            </Typography>
                        )}
                    </Typography>
                    {isLoadingEligibleStudents && <CircularProgress />}
                    {isErrorEligibleStudents && (
                        <Alert severity="error">
                            Error loading eligible students: {errorEligibleStudents?.message || 'An unknown error occurred.'}
                        </Alert>
                    )}
                    {!isLoadingEligibleStudents && !isErrorEligibleStudents && eligibleStudentsForCompany && eligibleStudentsForCompany.length === 0 && (
                        <Typography>No students are currently eligible for this company based on active policies.</Typography>
                    )}
                    {!isLoadingEligibleStudents && !isErrorEligibleStudents && eligibleStudentsForCompany && eligibleStudentsForCompany.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="eligible students table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">CGPA</TableCell>
                                        <TableCell>Placed</TableCell>
                                        <TableCell align="right">Current Salary</TableCell>
                                        <TableCell>Companies Applied</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {eligibleStudentsForCompany.map((student) => (
                                        <TableRow
                                            key={student.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {student.id}
                                            </TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell align="right">{student.cgpa.toFixed(2)}</TableCell>
                                            <TableCell>{student.isPlaced ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="right">{formatToINR(student.currentSalary)}</TableCell>
                                            <TableCell align="right">{student.companiesApplied}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default EligibilityCheckerPage; 