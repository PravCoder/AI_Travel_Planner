import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  TextField,
  Slider,
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";

// Define the parameters interface
export interface TripParameters {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: string;
  travelers: number;
}

// Component props
export interface CompactTripParametersProps {
  parameters: TripParameters;
  onParametersChange: (params: Partial<TripParameters>) => void;
}

/**
 * CompactTripParameters Component
 *
 * A compact, centered parameters bar with clickable sections
 * that open popover editors for each parameter
 */
const CompactTripParameters: React.FC<CompactTripParametersProps> = ({
  parameters,
  onParametersChange,
}) => {
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

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParametersChange({ location: e.target.value });
  };

  // Handle budget change (slider)
  const handleBudgetChange = (_: Event, newValue: number | number[]) => {
    const budgetMap: Record<number, string> = {
      1: "budget",
      2: "economy",
      3: "medium",
      4: "premium",
      5: "luxury",
    };
    const value = typeof newValue === "number" ? newValue : newValue[0];
    onParametersChange({ budget: budgetMap[value as 1 | 2 | 3 | 4 | 5] });
  };

  // Handle travelers change
  const handleTravelersChange = (e: SelectChangeEvent<number>) => {
    onParametersChange({ travelers: e.target.value as number });
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!parameters.startDate || !parameters.endDate) return "";

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const startDate = parameters.startDate.toLocaleDateString("en-US", options);
    const endDate = parameters.endDate.toLocaleDateString("en-US", options);
    return `${startDate} - ${endDate}`;
  };

  // Get budget value for slider
  const getBudgetValue = (budget: string): number => {
    const budgetMap: Record<string, number> = {
      budget: 1,
      economy: 2,
      medium: 3,
      premium: 4,
      luxury: 5,
    };
    return budgetMap[budget] || 3;
  };

  // Get budget symbol ($, $$, etc)
  const getBudgetSymbol = () => {
    const budgetMap: Record<string, string> = {
      budget: "$",
      economy: "$$",
      medium: "$$$",
      premium: "$$$$",
      luxury: "$$$$$",
    };
    return budgetMap[parameters.budget] || "$$$";
  };

  // Convert travelers to text
  const getTravelersText = (num: number): string => {
    if (num === 1) return "1 traveler";
    return `${num} travelers`;
  };

  // Budget marks for slider
  const budgetMarks = [
    { value: 1, label: "Budget" },
    { value: 2, label: "Economy" },
    { value: 3, label: "Medium" },
    { value: 4, label: "Premium" },
    { value: 5, label: "Luxury" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "4px 12px",
        borderRadius: "20px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        mx: "auto", // Center the component
        maxWidth: "fit-content",
      }}
    >
      {/* Location */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
        }}
        onClick={(e) => setLocationAnchorEl(e.currentTarget)}
      >
        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2" fontWeight="medium">
          {parameters.location}
        </Typography>
      </Box>
      <Popover
        open={Boolean(locationAnchorEl)}
        anchorEl={locationAnchorEl}
        onClose={() => setLocationAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            size="small"
            value={parameters.location}
            onChange={handleLocationChange}
            placeholder="e.g., Tokyo, Japan"
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            Popular destinations:
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
          >
            {["Tokyo", "Paris", "New York", "Rome", "Bangkok"].map((city) => (
              <Chip
                key={city}
                label={city}
                size="small"
                onClick={() => {
                  onParametersChange({ location: city });
                  setLocationAnchorEl(null);
                }}
              />
            ))}
          </Stack>
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ height: 20 }} />

      {/* Date Range */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
        }}
        onClick={(e) => setDateAnchorEl(e.currentTarget)}
      >
        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2" fontWeight="medium">
          {formatDateRange()}
        </Typography>
      </Box>
      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
              <DatePicker
                label="Start Date"
                value={parameters.startDate}
                onChange={(newValue) => {
                  onParametersChange({ startDate: newValue });
                }}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <DatePicker
                label="End Date"
                value={parameters.endDate}
                onChange={(newValue) => {
                  onParametersChange({ endDate: newValue });
                }}
                minDate={parameters.startDate ?? undefined}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Stack>
          </LocalizationProvider>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button size="small" onClick={() => setDateAnchorEl(null)}>
              Done
            </Button>
          </Box>
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ height: 20 }} />

      {/* Travelers */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
        }}
        onClick={(e) => setTravelersAnchorEl(e.currentTarget)}
      >
        <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2" fontWeight="medium">
          {getTravelersText(parameters.travelers)}
        </Typography>
      </Box>
      <Popover
        open={Boolean(travelersAnchorEl)}
        anchorEl={travelersAnchorEl}
        onClose={() => setTravelersAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="travelers-select-label">
              Number of Travelers
            </InputLabel>
            <Select
              labelId="travelers-select-label"
              value={parameters.travelers}
              label="Number of Travelers"
              onChange={handleTravelersChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <MenuItem key={num} value={num}>
                  {getTravelersText(num)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ height: 20 }} />

      {/* Budget */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
        }}
        onClick={(e) => setBudgetAnchorEl(e.currentTarget)}
      >
        <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2" fontWeight="medium">
          {getBudgetSymbol()}
        </Typography>
      </Box>
      <Popover
        open={Boolean(budgetAnchorEl)}
        anchorEl={budgetAnchorEl}
        onClose={() => setBudgetAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography id="budget-slider" gutterBottom>
            Budget Level
          </Typography>
          <Slider
            value={getBudgetValue(parameters.budget)}
            onChange={handleBudgetChange}
            step={1}
            marks={budgetMarks}
            min={1}
            max={5}
            sx={{
              mx: 1,
              width: "calc(100% - 16px)",
              "& .MuiSlider-markLabel": {
                whiteSpace: "nowrap",
                fontSize: "0.75rem",
                transform: "translateX(-50%)",
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button size="small" onClick={() => setBudgetAnchorEl(null)}>
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
};

export default CompactTripParameters;
