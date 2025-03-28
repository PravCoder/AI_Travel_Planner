// Updated SchedulePage.tsx to match Dashboard styling
import React from "react";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import Schedule from "../components/Schedule/Schedule";

const SchedulePage: React.FC = () => {
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h1">
                    My Schedule
                </Typography>
                <Box display="flex" alignItems="center">
                    <ButtonGroup sx={{ mr: 2 }}>
                        <Button variant="contained">
                            <ViewModuleIcon />
                        </Button>
                        <Button variant="outlined">
                            <ViewListIcon />
                        </Button>
                    </ButtonGroup>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                        New Event
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid container spacing={3}>
                        <Schedule />
                </Grid>
            </Grid>
        </>
    );
};

export default SchedulePage;
