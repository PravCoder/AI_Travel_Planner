import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Slider,
  Button,
  InputAdornment,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Styled components
const MapPlaceholder = styled(Paper)(({ theme }) => ({
  height: "100%",
  minHeight: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.secondary,
}));

const CreateTripPage: React.FC = () => {
  // State for prompt input
  const [prompt, setPrompt] = useState("");

  // State for budget slider
  const [budget, setBudget] = useState<number>(1000);

  // Handle prompt change
  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  // Handle budget change
  const handleBudgetChange = (_event: Event, newValue: number | number[]) => {
    setBudget(newValue as number);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Log the prompt and budget values to the console
    console.log("Trip generation request:");
    console.log("Prompt:", prompt);
    console.log("Budget: $" + budget);

    // Here we would send the data to the backend/AI model
    // Example API call:
    // api.generateTrip({ prompt, budget })
    //   .then(response => {
    //     // Handle successful response
    //   })
    //   .catch(error => {
    //     // Handle error
    //   });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Trip
      </Typography>

      <Grid container spacing={3}>
        {/* Left side - Prompt and Budget controls */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Prompt section */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Describe your dream trip
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Example: I want to plan a 7-day trip to Japan in April, focusing on traditional culture and food 
                    experiences."
                    value={prompt}
                    onChange={handlePromptChange}
                    sx={{ mb: 2 }}
                  />
                </Box>

                {/* Budget slider */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Set your budget
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon color="primary" />
                    <Slider
                      value={budget}
                      onChange={handleBudgetChange}
                      min={100}
                      max={10000}
                      step={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="budget-slider"
                      sx={{ mx: 2, flexGrow: 1 }}
                    />
                    <TextField
                      value={budget}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 100 && value <= 10000) {
                          setBudget(value);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      sx={{ width: "100px" }}
                    />
                  </Box>
                </Box>

                {/* Submit button */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    size="large"
                  >
                    Generate Trip
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Right side - Map placeholder */}
        <Grid item xs={12} md={6}>
          <MapPlaceholder>
            <Typography variant="h6">
              Google Maps will be integrated here
            </Typography>
          </MapPlaceholder>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTripPage;
