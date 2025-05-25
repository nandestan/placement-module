import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

// HomePage serves as the main landing page or dashboard for the application.
// It provides a welcome message and navigation buttons to key sections of the system.
const HomePage: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to the College Placement Policy System
                </Typography>
                <Typography variant="h6" component="p" color="text.secondary" sx={{ mb: 4 }}>
                    Manage student data, configure placement policies, and check eligibility with ease.
                </Typography>
                {/* Grid layout for primary navigation buttons */}
                <Grid container spacing={2} justifyContent="center">
                    <Grid>
                        <Button variant="contained" color="primary" component={RouterLink} to="/student-list" size="large">
                            View Student List
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" color="primary" component={RouterLink} to="/students/create" size="large">
                            Create New Student
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="secondary" component={RouterLink} to="/policies" size="large">
                            Edit Policies
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" color="secondary" component={RouterLink} to="/eligibility-check" size="large">
                            Check Eligibility
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* 
                Placeholder for potential future dashboard elements:
                - Quick Stats (e.g., Total Students, Percentage Placed)
                - Recent activity feed
                - Links to documentation or help sections
            */}

        </Container>
    );
};

export default HomePage;