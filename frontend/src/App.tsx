import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import PolicyEditorPage from './pages/policy-editor';
import StudentListPage from './pages/student-list';
import EligibilityCheckerPage from './pages/eligibility-checker';
import CreateStudentPage from './pages/CreateStudentPage';
import DocumentationPage from './pages/DocumentationPage';

// Define a custom MUI theme for consistent styling throughout the application.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
  },
});

// App is the root component that sets up the overall application structure,
// including theme, global styles, navigation, and routing.
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides a common baseline for styling across browsers. */}
      {/* Application Header / Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            College Placement Policy System
          </Typography>
          {/* Navigation links using MUI Button styled as react-router Link */}
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/student-list">Students</Button>
          <Button color="inherit" component={Link} to="/students/create">Create Student</Button>
          <Button color="inherit" component={Link} to="/policies">Policy Editor</Button>
          <Button color="inherit" component={Link} to="/eligibility-check">Eligibility Checker</Button>
          <Button color="inherit" component={Link} to="/documentation">Documentation</Button>
        </Toolbar>
      </AppBar>

      {/* Main content area where routed pages will be rendered. */}
      <Container component="main" sx={{ mt: 2, mb: 2 }}>
        <Routes> {/* Defines the application's routes and their corresponding page components. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/student-list" element={<StudentListPage />} />
          <Route path="/students/create" element={<CreateStudentPage />} />
          <Route path="/policies" element={<PolicyEditorPage />} />
          <Route path="/eligibility-check" element={<EligibilityCheckerPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Container>

      {/* Application Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '} {new Date().getFullYear()} College Placement System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
