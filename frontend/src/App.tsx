import React from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Routes, Route, Link } from 'react-router-dom'; // Import routing components
import HomePage from './pages/home'; // Import HomePage
import PolicyEditorPage from './pages/policy-editor'; // Import PolicyEditorPage
import StudentListPage from './pages/student-list'; // Import StudentListPage
import EligibilityCheckerPage from './pages/eligibility-checker'; // Import EligibilityCheckerPage

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            College Placement Policy System
          </Typography>
          <nav>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
              Home
            </Link>
            <Link to="/student-list" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
              Student List
            </Link>
            <Link to="/eligibility-check" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
              Check Eligibility
            </Link>
            <Link to="/policy-editor" style={{ color: 'white', textDecoration: 'none' }}>
              Policy Editor
            </Link>
          </nav>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/policy-editor" element={<PolicyEditorPage />} />
        <Route path="/eligibility-check" element={<EligibilityCheckerPage />} />
        <Route path="/student-list" element={<StudentListPage />} />
        {/* Add other routes here later */}
      </Routes>
    </>
  );
}

export default App;
