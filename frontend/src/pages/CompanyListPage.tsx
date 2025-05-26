import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    TextField
} from '@mui/material';
import { getCompanies } from '../api/company'; // API to fetch companies
import { Company } from '../interfaces/company';    // Company interface
import { formatToINR } from '../utils/formatting';  // INR formatting utility

const CompanyListPage: React.FC = () => {
    const { data: companies, isLoading, isError, error } = useQuery<Company[], Error>({
        queryKey: ['companies'],
        queryFn: getCompanies,
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = useMemo(() => {
        if (!companies) return [];
        if (!searchTerm) return companies;

        return companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [companies, searchTerm]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <Alert severity="error">Error fetching companies: {error?.message || 'Unknown error'}</Alert>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Companies
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Companies by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="companies table">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">Offered Salary</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCompanies && filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company) => (
                                <TableRow
                                    key={company.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {company.id}
                                    </TableCell>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell align="right">{formatToINR(company.offeredSalary)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    {searchTerm ? 'No companies match your search.' : 'No company data available.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CompanyListPage; 