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
import Slider from '@mui/material/Slider';

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
                ...prev[prev[policySection] ? policySection : Object.keys(prev)[0] as keyof PolicyConfig],
                [field]: value,
            },
        }));
    };

    const handleSwitchChange = (policySection: keyof PolicyConfig, field: string, checked: boolean) => {
        handleChange(policySection, field, checked);
    };

    const handleNumberChange = (policySection: keyof PolicyConfig, field: string, value: string) => {
        const numValue = parseFloat(value);
        handleChange(policySection, field, isNaN(numValue) ? '' : numValue);
    };

    const handleSliderChange = (policySection: keyof PolicyConfig, field: string, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            handleChange(policySection, field, newValue);
        }
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
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={<Switch checked={!!formData.maximumCompanies?.enabled} onChange={(e) => handleSwitchChange('maximumCompanies', 'enabled', e.target.checked)} />}
                            label="Enable Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Max Applications (N)"
                            type="number"
                            fullWidth
                            value={formData.maximumCompanies?.maxN ?? ''}
                            onChange={(e) => handleNumberChange('maximumCompanies', 'maxN', e.target.value)}
                            disabled={!formData.maximumCompanies?.enabled}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Slider
                            value={typeof formData.maximumCompanies?.maxN === 'number' ? formData.maximumCompanies.maxN : 0}
                            onChange={(event, newValue) => handleSliderChange('maximumCompanies', 'maxN', newValue)}
                            aria-labelledby="max-n-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={20}
                            disabled={!formData.maximumCompanies?.enabled}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Dream Offer Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Dream Offer Policy</Typography>
                <FormControlLabel
                    control={<Switch checked={!!formData.dreamOffer?.enabled} onChange={(e) => handleSwitchChange('dreamOffer', 'enabled', e.target.checked)} />}
                    label="Enable Dream Offer Declaration"
                />
            </Paper>

            {/* Dream Company Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Dream Company Policy</Typography>
                <FormControlLabel
                    control={<Switch checked={!!formData.dreamCompany?.enabled} onChange={(e) => handleSwitchChange('dreamCompany', 'enabled', e.target.checked)} />}
                    label="Enable Dream Company Declaration"
                />
            </Paper>

            {/* CGPA Threshold Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>CGPA Threshold Policy</Typography>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 12, md: 12 }}>
                        <FormControlLabel
                            control={<Switch checked={!!formData.cgpaThreshold?.enabled} onChange={(e) => handleSwitchChange('cgpaThreshold', 'enabled', e.target.checked)} />}
                            label="Enable Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Minimum CGPA (0.0-10.0)"
                            type="number"
                            fullWidth
                            value={formData.cgpaThreshold?.minimumCGPA ?? ''}
                            onChange={(e) => handleNumberChange('cgpaThreshold', 'minimumCGPA', e.target.value)}
                            disabled={!formData.cgpaThreshold?.enabled}
                            InputProps={{ inputProps: { min: 0, max: 10, step: "0.01" } }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <Slider
                            value={typeof formData.cgpaThreshold?.minimumCGPA === 'number' ? formData.cgpaThreshold.minimumCGPA : 0}
                            onChange={(event, newValue) => handleSliderChange('cgpaThreshold', 'minimumCGPA', newValue)}
                            aria-labelledby="min-cgpa-slider"
                            valueLabelDisplay="auto"
                            step={0.1}
                            marks
                            min={0}
                            max={10}
                            disabled={!formData.cgpaThreshold?.enabled}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="High Salary Threshold Amount"
                            type="number"
                            fullWidth
                            value={formData.cgpaThreshold?.highSalaryThreshold ?? ''}
                            onChange={(e) => handleNumberChange('cgpaThreshold', 'highSalaryThreshold', e.target.value)}
                            disabled={!formData.cgpaThreshold?.enabled}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <Slider
                            value={typeof formData.cgpaThreshold?.highSalaryThreshold === 'number' ? formData.cgpaThreshold.highSalaryThreshold : 0}
                            onChange={(event, newValue) => handleSliderChange('cgpaThreshold', 'highSalaryThreshold', newValue)}
                            aria-labelledby="high-salary-slider"
                            valueLabelDisplay="auto"
                            step={100000}
                            marks
                            min={0}
                            max={5000000}
                            disabled={!formData.cgpaThreshold?.enabled}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Placement Percentage Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Placement Percentage Policy</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={<Switch checked={!!formData.placementPercentage?.enabled} onChange={(e) => handleSwitchChange('placementPercentage', 'enabled', e.target.checked)} />}
                            label="Enable Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Target Percentage (0-100%)"
                            type="number"
                            fullWidth
                            value={formData.placementPercentage?.targetPercentage ?? ''}
                            onChange={(e) => handleNumberChange('placementPercentage', 'targetPercentage', e.target.value)}
                            disabled={!formData.placementPercentage?.enabled}
                            InputProps={{ inputProps: { min: 0, max: 100, step: "0.1" } }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Slider
                            value={typeof formData.placementPercentage?.targetPercentage === 'number' ? formData.placementPercentage.targetPercentage : 0}
                            onChange={(event, newValue) => handleSliderChange('placementPercentage', 'targetPercentage', newValue)}
                            aria-labelledby="target-percentage-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={100}
                            disabled={!formData.placementPercentage?.enabled}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Offer Category Policy */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Offer Category Policy</Typography>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 12, md: 12 }}>
                        <FormControlLabel
                            control={<Switch checked={!!formData.offerCategory?.enabled} onChange={(e) => handleSwitchChange('offerCategory', 'enabled', e.target.checked)} />}
                            label="Enable Policy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="L1 Threshold (Highest Tier)"
                            type="number"
                            fullWidth
                            value={formData.offerCategory?.l1ThresholdAmount ?? ''}
                            onChange={(e) => handleNumberChange('offerCategory', 'l1ThresholdAmount', e.target.value)}
                            disabled={!formData.offerCategory?.enabled}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <Slider
                            value={typeof formData.offerCategory?.l1ThresholdAmount === 'number' ? formData.offerCategory.l1ThresholdAmount : 0}
                            onChange={(event, newValue) => handleSliderChange('offerCategory', 'l1ThresholdAmount', newValue)}
                            aria-labelledby="l1-threshold-slider"
                            valueLabelDisplay="auto"
                            step={100000}
                            marks
                            min={0}
                            max={5000000}
                            disabled={!formData.offerCategory?.enabled}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="L2 Threshold (Middle Tier)"
                            type="number"
                            fullWidth
                            value={formData.offerCategory?.l2ThresholdAmount ?? ''}
                            onChange={(e) => handleNumberChange('offerCategory', 'l2ThresholdAmount', e.target.value)}
                            disabled={!formData.offerCategory?.enabled}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <Slider
                            value={typeof formData.offerCategory?.l2ThresholdAmount === 'number' ? formData.offerCategory.l2ThresholdAmount : 0}
                            onChange={(event, newValue) => handleSliderChange('offerCategory', 'l2ThresholdAmount', newValue)}
                            aria-labelledby="l2-threshold-slider"
                            valueLabelDisplay="auto"
                            step={100000}
                            marks
                            min={0}
                            max={3000000}
                            disabled={!formData.offerCategory?.enabled}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                        <TextField
                            label="Required Hike % for L2"
                            type="number"
                            fullWidth
                            value={formData.offerCategory?.requiredHikePercentage ?? ''}
                            onChange={(e) => handleNumberChange('offerCategory', 'requiredHikePercentage', e.target.value)}
                            disabled={!formData.offerCategory?.enabled}
                            InputProps={{ inputProps: { min: 0, step: "1" } }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <Slider
                            value={typeof formData.offerCategory?.requiredHikePercentage === 'number' ? formData.offerCategory.requiredHikePercentage : 0}
                            onChange={(event, newValue) => handleSliderChange('offerCategory', 'requiredHikePercentage', newValue)}
                            aria-labelledby="hike-percentage-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={100}
                            disabled={!formData.offerCategory?.enabled}
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