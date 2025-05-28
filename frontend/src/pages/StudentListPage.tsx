import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api/student'; // Ensure this path is correct
import { Student } from '../interfaces/student';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Container, Box, TextField, IconButton, Tooltip } from '@mui/material';
import { formatToINR } from '../utils/formatting'; // Import the formatting utility
import { Link } from 'react-router-dom';
import { Edit } from 'iconsax-react';

const StudentListPage: React.FC = () => {
    const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        if (!searchTerm) return students;

        return students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <Alert severity="error">Error fetching students: {error?.message || 'Unknown error'}</Alert>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Students
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Students by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">CGPA</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">Companies Applied</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">Dream Offer</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Dream Company</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">Current Salary</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Placement Status</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents && filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow
                                    key={student.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {student.id}
                                    </TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell align="right">{student.cgpa.toFixed(2)}</TableCell>
                                    <TableCell align="right">{student.companiesApplied}</TableCell>
                                    <TableCell align="right">{formatToINR(student.dreamOffer)}</TableCell>
                                    <TableCell>{student.dreamCompany || '-'}</TableCell>
                                    <TableCell align="right">{formatToINR(student.currentSalary)}</TableCell>
                                    <TableCell>{student.isPlaced ? 'Placed' : 'Not Placed'}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                component={Link}
                                                to={`/students/edit/${student.id}`}
                                            >
                                                <Edit size="18" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    {searchTerm ? 'No students match your search.' : 'No student data available.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StudentListPage;