import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Grid,
} from '@mui/material';

const DocumentationPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                    College Placement Policy System - Documentation
                </Typography>

                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3, mb: 2 }}>
                        1. Project Overview
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Problem Statement:
                    </Typography>
                    <Typography paragraph>
                        Colleges need a flexible system to enforce placement policies that determine which students are eligible to apply for additional companies after being placed or for high-paying positions based on various criteria.
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Solution:
                    </Typography>
                    <Typography paragraph>
                        A configurable software system that automates student eligibility checking based on college-defined policies, ensuring fair and transparent placement processes. The system can take configurations in JSON format.
                    </Typography>
                </Box>

                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3, mb: 2 }}>
                        Target Users & Benefits
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Target Users:
                    </Typography>
                    <List dense>
                        <ListItem><ListItemText primary="Placement Officers" /></ListItem>
                        <ListItem><ListItemText primary="College Administration" /></ListItem>
                        <ListItem><ListItemText primary="Training & Placement Departments" /></ListItem>
                    </List>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                        Benefits:
                    </Typography>
                    <List dense>
                        <ListItem><ListItemText primary="Flexible Policy Enforcement: Easily configure and adapt placement rules." /></ListItem>
                        <ListItem><ListItemText primary="Automated Eligibility Checks: Save time and reduce manual errors." /></ListItem>
                        <ListItem><ListItemText primary="Fairness and Transparency: Ensure consistent application of policies for all students." /></ListItem>
                        <ListItem><ListItemText primary="Configurable System: Define policies through a user interface or JSON, catering to specific college needs." /></ListItem>
                    </List>
                </Box>

                <Divider sx={{ my: 5 }} />

                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3 }}>
                        2. Functional Requirements
                    </Typography>

                    <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4, mb: 2 }}>
                        2.1 Policy Configuration Module
                    </Typography>
                    <Typography paragraph>
                        The system supports six core policy types that can be enabled/disabled independently. Configurations can be managed via a UI or JSON.
                    </Typography>

                    {[{
                        title: "2.1.1 Maximum Companies Policy",
                        description: "Controls how many additional companies a placed student can apply to.",
                        config: ["Enable/Disable toggle", "Numeric value (0 = no applications after placement, N = maximum N applications)"],
                        businessRule: "If set to 0, placed students cannot apply to any additional companies."
                    }, {
                        title: "2.1.2 Dream Offer Policy",
                        description: "Allows placed students to apply for companies offering salary equal to or above their declared dream amount.",
                        config: ["Enable/Disable toggle", "Students declare individual dream offer amounts"],
                        businessRule: "Placed students can apply only if company salary ≥ student's dream offer."
                    }, {
                        title: "2.1.3 Dream Company Policy",
                        description: "Allows placed students to apply to their pre-declared dream company regardless of other restrictions.",
                        config: ["Enable/Disable toggle", "Students declare individual dream companies"],
                        businessRule: "Placed students can apply to their dream company even if other policies would block them."
                    }, {
                        title: "2.1.4 CGPA Threshold Policy",
                        description: "Requires minimum CGPA for high-paying positions.",
                        config: ["Enable/Disable toggle", "Minimum CGPA value (0.0-10.0)", "High-salary threshold amount"],
                        businessRule: "Students can apply for companies offering above threshold salary only if their CGPA ≥ minimum requirement."
                    }, {
                        title: "2.1.5 Placement Percentage Policy",
                        description: "Allows placed students to apply for additional companies only when overall placement percentage reaches target.",
                        config: ["Enable/Disable toggle", "Target placement percentage (0-100%)"],
                        businessRule: "Placed students cannot apply until (placed students / total students) * 100 ≥ target percentage."
                    }, {
                        title: "2.1.6 Offer Category Policy",
                        description: "Categorizes offers into tiers with specific rules for each tier.",
                        config: ["Enable/Disable toggle", "L1 threshold amount (highest tier)", "L2 threshold amount (middle tier)", "L3 = below L2 threshold (lowest tier)", "Required hike percentage for L2 students"],
                        businessRules: [
                            "L1 placed students: Cannot apply to any other companies.",
                            "L2 placed students: Can apply only to companies offering ≥ X% hike over current salary.",
                            "L3 placed students: Can apply based on other active policies."
                        ]
                    }].map((policy, index) => (
                        <Box key={index} sx={{ mb: 3, p: { xs: 2, sm: 3 }, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                            <Typography variant="h6" component="h4" gutterBottom>{policy.title}</Typography>
                            <Typography variant="subtitle1" gutterBottom><strong>Description:</strong> {policy.description}</Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 1.5 }}>Configuration:</Typography>
                            <List dense disablePadding sx={{ pl: 2 }}>
                                {policy.config.map((item, i) => <ListItem key={i} disableGutters sx={{ py: 0.25 }}><ListItemText primary={`• ${item}`} /></ListItem>)}
                            </List>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 1.5 }}>Business Rule(s):</Typography>
                            {policy.businessRule && <Typography paragraph sx={{ pl: 2, mb: 0 }}>• {policy.businessRule}</Typography>}
                            {policy.businessRules && (
                                <List dense disablePadding sx={{ pl: 2 }}>
                                    {policy.businessRules.map((item, i) => <ListItem key={i} disableGutters sx={{ py: 0.25 }}><ListItemText primary={`• ${item}`} /></ListItem>)}
                                </List>
                            )}
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 5 }} />

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
                                2.2 Student Data
                            </Typography>
                            <Typography paragraph>
                                The software utilizes student information structured as follows:
                            </Typography>
                            <List dense>
                                <ListItem><ListItemText primary="1. Basic Information: Unique Student ID, Full Name, CGPA (0.0-10.0 scale)" /></ListItem>
                                <ListItem><ListItemText primary="2. Placement Status: Is Placed (Yes/No), Current Salary (if placed), Number of companies already applied to" /></ListItem>
                                <ListItem><ListItemText primary="3. Preferences: Dream Offer Amount, Dream Company Name" /></ListItem>
                            </List>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
                                2.3 Company Information
                            </Typography>
                            <Typography paragraph>
                                The software takes company information as input (e.g., via JSON or internal data). Required information typically includes Company ID, Name, and Offered Salary.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
                                2.4 Eligibility Engine Module
                            </Typography>
                            <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 2 }}>
                                2.4.1 Core Logic Requirements:
                            </Typography>
                            <List dense>
                                <ListItem><ListItemText primary="1. Process all active policies simultaneously." /></ListItem>
                                <ListItem><ListItemText primary="2. Handle policy conflicts intelligently (e.g., Dream Company override)." /></ListItem>
                                <ListItem><ListItemText primary="3. Provide detailed reasoning for each decision." /></ListItem>
                                <ListItem><ListItemText primary="4. Support real-time policy changes." /></ListItem>
                            </List>
                            <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 2 }}>
                                2.4.2 Decision Matrix (System Must):
                            </Typography>
                            <List dense>
                                <ListItem><ListItemText primary="1. Check if student is placed or unplaced." /></ListItem>
                                <ListItem><ListItemText primary="2. Apply all active policies in sequence." /></ListItem>
                                <ListItem><ListItemText primary="3. Determine final eligibility (Eligible/Not Eligible)." /></ListItem>
                                <ListItem><ListItemText primary="4. Generate detailed reasoning list." /></ListItem>
                                <ListItem><ListItemText primary="5. Handle edge cases and policy interactions." /></ListItem>
                            </List>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
                                2.4.3 Output Requirements
                            </Typography>
                            <Typography paragraph>
                                For each student-company combination, the system provides:
                            </Typography>
                            <List dense>
                                <ListItem><ListItemText primary="1. Final eligibility status (Boolean)." /></ListItem>
                                <ListItem><ListItemText primary="2. List of reasons supporting the decision." /></ListItem>
                                <ListItem><ListItemText primary="3. Policy-specific details where applicable." /></ListItem>
                            </List>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 5 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3 }}>
                        3. Sample Policy Interaction Scenarios
                    </Typography>
                    <Typography paragraph>
                        The system is designed to handle complex interactions between policies. For example:
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                primary="Dream Offer + CGPA Test:"
                                secondary="A student with a CGPA of 6.5 and a dream offer of ₹15,00,000, currently placed at ₹8,00,000, applies to a company offering ₹15,00,000. If a CGPA policy requires 7.0 for offers above ₹12,00,000, the student might be eligible if the Dream Offer policy overrides the CGPA block for dream offers, or ineligible if the CGPA policy is a hard block for high offers."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                primary="Category + Max Companies Test:"
                                secondary="An L2 placed student (e.g., salary ₹25,00,000) applied to 2 companies (max allowed 3). If they apply to a company offering ₹30,00,000 (which is less than the required hike percentage over their current salary), they would be not eligible due to insufficient hike, even if they are within the max companies limit."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                primary="Placement Percentage Test:"
                                secondary="If current campus placement is 75% and the policy threshold is 90%, a placed student wanting to apply for another company would be not eligible due to the overall placement percentage being below the target."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                primary="Multiple Qualifying Policies:"
                                secondary="A student might qualify for a company under both their Dream Company policy and their Dream Offer policy. The system should list both as reasons."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                primary="Policy Conflicts:"
                                secondary="If a student is blocked by one policy (e.g., Maximum Companies) but allowed by an overriding policy (e.g., Dream Company), the system should gracefully handle this, clearly stating the overriding reason for eligibility."
                            />
                        </ListItem>
                    </List>
                </Box>

            </Paper>
        </Container>
    );
};

export default DocumentationPage;