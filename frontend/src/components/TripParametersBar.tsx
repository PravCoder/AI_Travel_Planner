import React, { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Chip,
  Menu,
  MenuItem,
  TextField,
  Slider,
  Typography,
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";

// Define the props interface
interface TripParametersBarProps {
  onParametersChange: (parameters: TripParameters) => void;
}

// Define the parameters interface
export interface TripParameters {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number;
  travelers: number;
}

const TripParametersBar: React.FC<TripParametersBarProps> = ({
  onParametersChange,
}) => {
  // State for parameters
  const [parameters, setParameters] = useState<TripParameters>({
    location: "",
    startDate: null,
    endDate: null,
    budget: 3, // Medium budget on scale 1-5
    travelers: 1,
  });

  // State for popover anchors
  const [locationAnchorEl, setLocationAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const [budgetAnchorEl, setBudgetAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [travelersAnchorEl, setTravelersAnchorEl] =
    useState<HTMLElement | null>(null);

  // Handle parameter changes
  const handleParameterChange = (param: keyof TripParameters, value: any) => {
    const updatedParameters = { ...parameters, [param]: value };
    setParameters(updatedParameters);
    onParametersChange(updatedParameters);
  };

  // Handle popover open/close
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  ) => {
    setter(event.currentTarget);
  };

  const handlePopoverClose = (
    setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  ) => {
    setter(null);
  };

  // Get display text for parameters
  const getLocationDisplay = () => parameters.location || "Select Location";

  const getDateDisplay = () => {
    if (parameters.startDate && parameters.endDate) {
      return `${parameters.startDate.toLocaleDateString()} - ${parameters.endDate.toLocaleDateString()}`;
    }
    return "Select Dates";
  };

  const getBudgetDisplay = () => {
    const budgetLabels = ["Budget", "Economy", "Standard", "Premium", "Luxury"];
    return budgetLabels[parameters.budget - 1];
  };

  const getTravelersDisplay = () =>
    `${parameters.travelers} Traveler${parameters.travelers !== 1 ? "s" : ""}`;

  return (
    <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
      <Stack direction="row" spacing={1} sx={{ overflowX: "auto", py: 0.5 }}>
        {/* Location Chip */}
        <Chip
          icon={<LocationOnIcon />}
          label={getLocationDisplay()}
          onClick={(e) => handlePopoverOpen(e, setLocationAnchorEl)}
          color={parameters.location ? "primary" : "default"}
        />
        <Popover
          open={Boolean(locationAnchorEl)}
          anchorEl={locationAnchorEl}
          onClose={() => handlePopoverClose(setLocationAnchorEl)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              Enter Location
            </Typography>
            <TextField
              fullWidth
              placeholder="City, Country"
              value={parameters.location}
              onChange={(e) =>
                handleParameterChange("location", e.target.value)
              }
              size="small"
            />
            <Button
              sx={{ mt: 1 }}
              onClick={() => handlePopoverClose(setLocationAnchorEl)}
              variant="contained"
              size="small"
            >
              Apply
            </Button>
          </Box>
        </Popover>

        {/* Date Range Chip */}
        <Chip
          icon={<CalendarTodayIcon />}
          label={getDateDisplay()}
          onClick={(e) => handlePopoverOpen(e, setDateAnchorEl)}
          color={
            parameters.startDate && parameters.endDate ? "primary" : "default"
          }
        />
        <Popover
          open={Boolean(dateAnchorEl)}
          anchorEl={dateAnchorEl}
          onClose={() => handlePopoverClose(setDateAnchorEl)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 2, width: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Date Range
              </Typography>
              <Stack spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={parameters.startDate}
                  onChange={(date) => handleParameterChange("startDate", date)}
                />
                <DatePicker
                  label="End Date"
                  value={parameters.endDate}
                  onChange={(date) => handleParameterChange("endDate", date)}
                  minDate={parameters.startDate || undefined}
                />
                <Button
                  onClick={() => handlePopoverClose(setDateAnchorEl)}
                  variant="contained"
                  size="small"
                >
                  Apply
                </Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Popover>

        {/* Budget Chip */}
        <Chip
          icon={<AttachMoneyIcon />}
          label={getBudgetDisplay()}
          onClick={(e) => handlePopoverOpen(e, setBudgetAnchorEl)}
          color="primary"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="No Budget"
          sx={{ ml: 1 }}
        />
        <Popover
          open={Boolean(budgetAnchorEl)}
          anchorEl={budgetAnchorEl}
          onClose={() => handlePopoverClose(setBudgetAnchorEl)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Budget Level
            </Typography>
            <Slider
              value={parameters.budget}
              onChange={(_, value) => handleParameterChange("budget", value)}
              min={1}
              max={5}
              step={1}
              marks={[
                { value: 1, label: "Budget" },
                { value: 2, label: "Economy" },
                { value: 3, label: "Standard" },
                { value: 4, label: "Premium" },
                { value: 5, label: "Luxury" },
              ]}
              valueLabelDisplay="off"
              sx={{
                mx: 1,
                width: "calc(100% - 16px)",
                "& .MuiSlider-markLabel": {
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                  transform: "translateX(-50%)",
                },
              }}
            />
            <Button
              sx={{ mt: 1 }}
              onClick={() => handlePopoverClose(setBudgetAnchorEl)}
              variant="contained"
              size="small"
            >
              Apply
            </Button>
          </Box>
        </Popover>

        {/* Travelers Chip */}
        <Chip
          icon={<PeopleIcon />}
          label={getTravelersDisplay()}
          onClick={(e) => handlePopoverOpen(e, setTravelersAnchorEl)}
          color="primary"
        />
        <Popover
          open={Boolean(travelersAnchorEl)}
          anchorEl={travelersAnchorEl}
          onClose={() => handlePopoverClose(setTravelersAnchorEl)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              Number of Travelers
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Travelers</InputLabel>
              <Select
                value={parameters.travelers.toString()}
                label="Travelers"
                onChange={(e: SelectChangeEvent) =>
                  handleParameterChange("travelers", parseInt(e.target.value))
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              sx={{ mt: 1 }}
              onClick={() => handlePopoverClose(setTravelersAnchorEl)}
              variant="contained"
              size="small"
            >
              Apply
            </Button>
          </Box>
        </Popover>
      </Stack>
    </Paper>
  );
};

export default TripParametersBar;
