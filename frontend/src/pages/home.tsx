import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';

const HomePage: React.FC = () => {
    return (
        <Container sx={{ marginTop: 2 }}>
            <Typography variant="h4" gutterBottom component="h1" sx={{ textAlign: 'center', marginBottom: 3 }}>
                Placement Policy Dashboard
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Button component={RouterLink} to="/student-list" variant="contained" color="primary">
                    Student List
                </Button>
                <Button component={RouterLink} to="/policy-editor" variant="contained" color="primary">
                    Policy Editor
                </Button>
                <Button component={RouterLink} to="/eligibility-check" variant="contained" color="primary">
                    Eligibility Checker
                </Button>
                {/* Placeholder for future Placement Status button */}
                {/* <Button component={RouterLink} to="/placement-status" variant="contained" color="primary">
                     Placement Status
                </Button> */}
            </Box>

            {/* Content for HomePage can go here if any, or it can just be a navigation hub */}
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Select an option above to manage or view placement information.
            </Typography>
        </Container>
    );
};

export default HomePage;