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
import CompanyListPage from './pages/CompanyListPage';

// Define a custom MUI theme for consistent styling throughout the application.
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC300', // Honey Yellow
      contrastText: '#000000', // Black text for good contrast on yellow
    },
    secondary: {
      main: '#0D47A1', // Deep Blue for contrast and secondary actions
      contrastText: '#FFFFFF', // White text for good contrast on blue
    },
    background: {
      default: '#f5f5f5', // A light grey background for the body
      paper: '#ffffff',   // White for paper elements like cards, tables
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1.1rem', fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFC300', // Honey Yellow for AppBar
          color: '#000000', // Black text on AppBar
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#000000', // Ensure text on primary buttons is black
          "&:hover": {
            backgroundColor: '#ebb500', // Darker yellow on hover
          }
        },
        containedSecondary: {
          color: '#FFFFFF', // Ensure text on secondary buttons is white
          "&:hover": {
            backgroundColor: '#0a367e', // Darker blue on hover
          }
        }
      }
    }
  }
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
          <Button color="inherit" component={Link} to="/companies">Companies</Button>
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
          <Route path="/companies" element={<CompanyListPage />} />
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
