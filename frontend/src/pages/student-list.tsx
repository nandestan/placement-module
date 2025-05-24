import React from 'react';
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

const StudentListPage: React.FC = () => {
    const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (isError) {
        return <Alert severity="error">Error fetching students: {error?.message}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h5" gutterBottom component="h2" sx={{ marginBottom: 2 }}>
                Students
            </Typography>
            {students && students.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="students table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">CGPA</TableCell>
                                <TableCell>Companies Applied</TableCell>
                                <TableCell>Dream Offer</TableCell>
                                <TableCell>Dream Company</TableCell>
                                <TableCell>Current Offer Category</TableCell>
                                <TableCell>Placement Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow
                                    key={student.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {student.id}
                                    </TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell align="right">{student.cgpa.toFixed(2)}</TableCell>
                                    <TableCell>{student.companiesApplied}</TableCell>
                                    <TableCell>{student.dreamOffer}</TableCell>
                                    <TableCell>{student.dreamCompany}</TableCell>
                                    <TableCell>{student.currentOfferCategory ? student.currentOfferCategory : '-'}</TableCell>
                                    <TableCell>{student.isPlaced ? 'Placed' : 'Not Placed'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No students found.</Typography>
            )}
        </Paper>
    );
};

export default StudentListPage;