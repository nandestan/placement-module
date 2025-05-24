import React from 'react';
import { Student } from '../interfaces/student'; // Import the interface
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // For layout

interface StudentDetailsProps {
    student: Student | null; // Allow student to be null if no student is selected/loaded
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student }) => {
    if (!student) {
        return (
            <Typography variant="h6" component="p" gutterBottom>
                No student data available or selected.
            </Typography>
        );
    }

    return (
        <Card sx={{ minWidth: 275, marginTop: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {student.name} (ID: {student.id})
                </Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary">CGPA:</Typography>
                        <Typography variant="body1">{student.cgpa.toFixed(2)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary">Placement Status:</Typography>
                        <Typography variant="body1">{student.isPlaced ? 'Placed' : 'Not Placed'}</Typography>
                    </Grid>
                    {student.isPlaced && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography color="text.secondary">Current Salary:</Typography>
                                <Typography variant="body1">{student.currentSalary.toLocaleString()}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography color="text.secondary">Current Offer Category:</Typography>
                                <Typography variant="body1">{student.currentOfferCategory || 'N/A'}</Typography>
                            </Grid>
                        </>
                    )}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary">Companies Applied:</Typography>
                        <Typography variant="body1">{student.companiesApplied}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary">Dream Offer Amount:</Typography>
                        <Typography variant="body1">{student.dreamOffer.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary">Dream Company:</Typography>
                        <Typography variant="body1">{student.dreamCompany}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default StudentDetails; 