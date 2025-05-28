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
import PolicyEditorPage from './pages/PolicyEditorPage';
import StudentListPage from './pages/StudentListPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import CreateStudentPage from './pages/CreateStudentPage';
import DocumentationPage from './pages/DocumentationPage';
import CompanyListPage from './pages/CompanyListPage';
import EditStudentPage from './pages/EditStudentPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC300',
      contrastText: '#000000',
    },
    secondary: {
      main: '#404040',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
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
          backgroundColor: '#FFC300',
          color: '#000000',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#000000',
          "&:hover": {
            backgroundColor: '#ebb500',
          }
        },
        containedSecondary: {
          color: '#FFFFFF',
          "&:hover": {
            backgroundColor: '#0a367e',
          }
        }
      }
    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            College Placement Policy System
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/student-list">Students</Button>
          <Button color="inherit" component={Link} to="/students/create">Create Student</Button>
          <Button color="inherit" component={Link} to="/companies">Companies</Button>
          <Button color="inherit" component={Link} to="/policies">Policy Editor</Button>
          <Button color="inherit" component={Link} to="/eligibility-check">Eligibility Checker</Button>
          <Button color="inherit" component={Link} to="/documentation">Documentation</Button>
        </Toolbar>
      </AppBar>

      {/* Routes */}
      <Container component="main" sx={{ mt: 2, mb: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student-list" element={<StudentListPage />} />
          <Route path="/students/create" element={<CreateStudentPage />} />
          <Route path="/students/edit/:id" element={<EditStudentPage />} />
          <Route path="/companies" element={<CompanyListPage />} />
          <Route path="/policies" element={<PolicyEditorPage />} />
          <Route path="/eligibility-check" element={<EligibilityCheckerPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Container>

      {/* Footer */}
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
