import React, { useState, useEffect } from 'react';
import { PolicyConfig } from '../interfaces/policy';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PolicyFormProps {
    initialData: PolicyConfig;
    onSubmit: (data: PolicyConfig) => void;
    isSaving: boolean;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ initialData, onSubmit, isSaving }) => {
    const [formData, setFormData] = useState<PolicyConfig>(initialData);
    const [expanded, setExpanded] = useState<string | false>(false);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleChange = (policySection: keyof PolicyConfig, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [policySection]: {
                ...(prev[policySection] || {}), // Ensure policy section exists
                [field]: value,
            },
        }));
    };

    const handleSwitchChange = (policySection: keyof PolicyConfig, field: string, checked: boolean) => {
        // When a policy is disabled, we might want to reset its specific values or leave them as is.
        // For now, just updating the enabled status.
        setFormData(prev => ({
            ...prev,
            [policySection]: {
                ...(prev[policySection] || {}),
                [field]: checked,
            },
        }));
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

    // Helper to create Textfield and Slider pair
    const renderNumericInput = (
        policyName: keyof PolicyConfig,
        fieldName: string,
        label: string,
        min: number,
        max: number,
        step: number,
        textFieldStep?: string | number
    ) => {
        const policy = formData[policyName] as any; // Type assertion
        const isEnabled = policy?.enabled;
        const value = policy?.[fieldName] ?? '';

        return (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={label}
                        type="number"
                        fullWidth
                        value={value}
                        onChange={(e) => handleNumberChange(policyName, fieldName, e.target.value)}
                        disabled={!isEnabled}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Slider
                        value={typeof value === 'number' ? value : min}
                        onChange={(event, newValue) => handleSliderChange(policyName, fieldName, newValue)}
                        aria-labelledby={`${policyName}-${fieldName}-slider`}
                        valueLabelDisplay="auto"
                        step={step}
                        marks
                        min={min}
                        max={max}
                        disabled={!isEnabled}
                    />
                </Grid>
            </Grid>
        );
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Maximum Companies Policy */}
            <Accordion expanded={expanded === 'maximumCompanies'} onChange={handleAccordionChange('maximumCompanies')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.maximumCompanies?.enabled}
                                onChange={(e) => handleSwitchChange('maximumCompanies', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling when switch is clicked
                            />
                        }
                        label={<Typography variant="h6">Maximum Companies Policy</Typography>}
                        onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
                        onFocus={(e) => e.stopPropagation()} // Prevent accordion from toggling
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {renderNumericInput('maximumCompanies', 'maxN', 'Max Applications (N)', 0, 20, 1)}
                </AccordionDetails>
            </Accordion>

            {/* Dream Offer Policy */}
            <Accordion expanded={expanded === 'dreamOffer'} onChange={handleAccordionChange('dreamOffer')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.dreamOffer?.enabled}
                                onChange={(e) => handleSwitchChange('dreamOffer', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<Typography variant="h6">Dream Offer Policy</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="textSecondary">
                        {formData.dreamOffer?.enabled ? "Students can declare a dream offer. Further configurations might be added here later." : "This policy is currently disabled."}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Dream Company Policy */}
            <Accordion expanded={expanded === 'dreamCompany'} onChange={handleAccordionChange('dreamCompany')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.dreamCompany?.enabled}
                                onChange={(e) => handleSwitchChange('dreamCompany', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<Typography variant="h6">Dream Company Policy</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="textSecondary">
                        {formData.dreamCompany?.enabled ? "Students can declare a dream company. Further configurations might be added here later." : "This policy is currently disabled."}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* CGPA Threshold Policy */}
            <Accordion expanded={expanded === 'cgpaThreshold'} onChange={handleAccordionChange('cgpaThreshold')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.cgpaThreshold?.enabled}
                                onChange={(e) => handleSwitchChange('cgpaThreshold', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<Typography variant="h6">CGPA Threshold Policy</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {renderNumericInput('cgpaThreshold', 'minimumCGPA', 'Minimum CGPA (0.0-10.0)', 0, 10, 0.1, "0.01")}
                    {renderNumericInput('cgpaThreshold', 'highSalaryThreshold', 'High Salary Threshold Amount', 0, 5000000, 100000)}
                </AccordionDetails>
            </Accordion>

            {/* Placement Percentage Policy */}
            <Accordion expanded={expanded === 'placementPercentage'} onChange={handleAccordionChange('placementPercentage')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.placementPercentage?.enabled}
                                onChange={(e) => handleSwitchChange('placementPercentage', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<Typography variant="h6">Placement Percentage Policy</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {renderNumericInput('placementPercentage', 'targetPercentage', 'Target Percentage (0-100%)', 0, 100, 1, "0.1")}
                </AccordionDetails>
            </Accordion>

            {/* Offer Category Policy */}
            <Accordion expanded={expanded === 'offerCategory'} onChange={handleAccordionChange('offerCategory')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.offerCategory?.enabled}
                                onChange={(e) => handleSwitchChange('offerCategory', 'enabled', e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<Typography variant="h6">Offer Category Policy</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {renderNumericInput('offerCategory', 'l1ThresholdAmount', 'L1 Threshold (Highest Tier)', 0, 5000000, 100000)}
                    {renderNumericInput('offerCategory', 'l2ThresholdAmount', 'L2 Threshold (Middle Tier)', 0, 3000000, 100000)}
                    {renderNumericInput('offerCategory', 'requiredHikePercentage', 'Required Hike % for L2', 0, 100, 1)}
                </AccordionDetails>
            </Accordion>

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