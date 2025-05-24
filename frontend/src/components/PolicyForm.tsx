import React, { useState, useEffect } from 'react';
import { PolicyConfig, MaximumCompaniesPolicy, DreamOfferPolicy, DreamCompanyPolicy, CGPAThresholdPolicy, PlacementPercentagePolicy, OfferCategoryPolicy } from '../interfaces/policy';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface PolicyFormProps {
    initialData: PolicyConfig;
    onSubmit: (data: PolicyConfig) => void;
    isSaving: boolean;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ initialData, onSubmit, isSaving }) => {
    const [formData, setFormData] = useState<PolicyConfig>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (policySection: keyof PolicyConfig, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [policySection]: {
                ...prev[policySection],
                [field]: value,
            },
        }));
    };

    const handleSwitchChange = (policySection: keyof PolicyConfig, field: string, checked: boolean) => {
        handleChange(policySection, field, checked);
    };

    const handleNumberChange = (policySection: keyof PolicyConfig, field: string, value: string) => {
        const numValue = parseFloat(value);
        handleChange(policySection, field, isNaN(numValue) ? 0 : numValue); // Default to 0 if NaN
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(formData);
    };

    if (!formData) {
        return <Typography>Loading form data...</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Maximum Companies Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Maximum Companies Policy</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box>
                            <FormControlLabel
                                control={<Switch checked={formData.maximumCompanies.enabled} onChange={(e) => handleSwitchChange('maximumCompanies', 'enabled', e.target.checked)} />}
                                label="Enable Maximum Companies Policy"
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Max Number of Applications (Max N)"
                            type="number"
                            fullWidth
                            value={formData.maximumCompanies.maxN}
                            onChange={(e) => handleNumberChange('maximumCompanies', 'maxN', e.target.value)}
                            disabled={!formData.maximumCompanies.enabled}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Dream Offer Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Dream Offer Policy</Typography>
                <FormControlLabel
                    control={<Switch checked={formData.dreamOffer.enabled} onChange={(e) => handleSwitchChange('dreamOffer', 'enabled', e.target.checked)} />}
                    label="Enable Dream Offer Declaration"
                />
            </Paper>

            {/* Dream Company Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Dream Company Policy</Typography>
                <FormControlLabel
                    control={<Switch checked={formData.dreamCompany.enabled} onChange={(e) => handleSwitchChange('dreamCompany', 'enabled', e.target.checked)} />}
                    label="Enable Dream Company Declaration"
                />
            </Paper>

            {/* CGPA Threshold Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>CGPA Threshold Policy</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControlLabel
                            control={<Switch checked={formData.cgpaThreshold.enabled} onChange={(e) => handleSwitchChange('cgpaThreshold', 'enabled', e.target.checked)} />}
                            label="Enable CGPA Threshold Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Minimum CGPA (0.0-10.0)"
                            type="number"
                            fullWidth
                            value={formData.cgpaThreshold.minimumCGPA}
                            onChange={(e) => handleNumberChange('cgpaThreshold', 'minimumCGPA', e.target.value)}
                            disabled={!formData.cgpaThreshold.enabled}
                            InputProps={{ inputProps: { min: 0, max: 10, step: "0.01" } }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="High Salary Threshold Amount"
                            type="number"
                            fullWidth
                            value={formData.cgpaThreshold.highSalaryThreshold}
                            onChange={(e) => handleNumberChange('cgpaThreshold', 'highSalaryThreshold', e.target.value)}
                            disabled={!formData.cgpaThreshold.enabled}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Placement Percentage Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Placement Percentage Policy</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControlLabel
                            control={<Switch checked={formData.placementPercentage.enabled} onChange={(e) => handleSwitchChange('placementPercentage', 'enabled', e.target.checked)} />}
                            label="Enable Placement Percentage Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Target Placement Percentage (0-100%)"
                            type="number"
                            fullWidth
                            value={formData.placementPercentage.targetPercentage}
                            onChange={(e) => handleNumberChange('placementPercentage', 'targetPercentage', e.target.value)}
                            disabled={!formData.placementPercentage.enabled}
                            InputProps={{ inputProps: { min: 0, max: 100, step: "0.1" } }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Offer Category Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Offer Category Policy</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={<Switch checked={formData.offerCategory.enabled} onChange={(e) => handleSwitchChange('offerCategory', 'enabled', e.target.checked)} />}
                            label="Enable Offer Category Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="L1 Threshold Amount (Highest Tier)"
                            type="number"
                            fullWidth
                            value={formData.offerCategory.l1ThresholdAmount}
                            onChange={(e) => handleNumberChange('offerCategory', 'l1ThresholdAmount', e.target.value)}
                            disabled={!formData.offerCategory.enabled}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="L2 Threshold Amount (Middle Tier)"
                            type="number"
                            fullWidth
                            value={formData.offerCategory.l2ThresholdAmount}
                            onChange={(e) => handleNumberChange('offerCategory', 'l2ThresholdAmount', e.target.value)}
                            disabled={!formData.offerCategory.enabled}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Required Hike Percentage for L2 (e.g., 30 for 30%)"
                            type="number"
                            fullWidth
                            value={formData.offerCategory.requiredHikePercentage}
                            onChange={(e) => handleNumberChange('offerCategory', 'requiredHikePercentage', e.target.value)}
                            disabled={!formData.offerCategory.enabled}
                            InputProps={{ inputProps: { min: 0, step: "1" } }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSaving}
            >
                {isSaving ? 'Saving Policies...' : 'Save All Policies'}
            </Button>
        </Box>
    );
};

export default PolicyForm; 