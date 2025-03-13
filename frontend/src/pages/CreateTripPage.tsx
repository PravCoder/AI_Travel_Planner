import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";
import { TripParameters } from "../components/CompactTripParameters";
import CompactTripParameters from "../components/CompactTripParameters";
import ChatInterface, { ChatMessageType } from "../components/ChatInterface";
import MapIntegration from "../components/MapIntegration";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";

/**
 * CreateTripPage Component
 *
 * Main page for creating a new trip using chat-based AI interaction
 * Features itinerary-style chat and map view similar to travel planning apps
 */
const CreateTripPage: React.FC = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  // Trip parameters state - initialize with URL param if available
  const [tripParameters, setTripParameters] = useState<TripParameters>({
    location: searchParams.get("destination") || "",
    startDate: null,
    endDate: null,
    budget: "budget",
    travelers: 1,
  });

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle parameter changes
  const handleParameterChange = (newParams: Partial<TripParameters>) => {
    setTripParameters((prev) => {
      const updated = { ...prev, ...newParams };

      // Log budget changes specifically
      if ("budget" in newParams && newParams.budget !== undefined) {
        const budgetValue = newParams.budget;
        // Map budget string values to their display names
        const budgetDisplayMap: Record<string, string> = {
          budget: "Budget",
          economy: "Economy",
          medium: "Medium",
          premium: "Premium",
          luxury: "Luxury",
        };
        // Map budget string values to their number of $
        const budgetValueMap: Record<string, string> = {
          budget: "$",
          economy: "$$",
          medium: "$$$",
          premium: "$$$$",
          luxury: "$$$$$",
        };

        console.log(
          "Budget changed:",
          budgetDisplayMap[budgetValue.toString()] || budgetValue,
          `(Value: ${budgetValueMap[budgetValue.toString()] || budgetValue})`
        );
      }

      // Log location changes
      if (newParams.location && newParams.location !== prev.location) {
        console.log("Location changed:", newParams.location);
      }

      // Log date changes
      if (
        (newParams.startDate && newParams.startDate !== prev.startDate) ||
        (newParams.endDate && newParams.endDate !== prev.endDate)
      ) {
        const startDateText = newParams.startDate
          ? newParams.startDate.toLocaleDateString()
          : prev.startDate?.toLocaleDateString();
        const endDateText = newParams.endDate
          ? newParams.endDate.toLocaleDateString()
          : prev.endDate?.toLocaleDateString();

        console.log("Dates changed:", `${startDateText} - ${endDateText}`);
      }

      // Log travelers changes
      if (newParams.travelers && newParams.travelers !== prev.travelers) {
        console.log("Travelers changed:", newParams.travelers);
      }

      return updated;
    });
  };

  // Handle sending a message
  const handleSendMessage = (messageText: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      // Create AI response based on the message and parameters
      const aiResponseText = generateAIResponse(messageText, tripParameters);

      const aiMessage: ChatMessageType = {
        id: uuidv4(),
        text:
          aiResponseText ||
          `I'll help you plan your trip to ${tripParameters.location}. What would you like to know?`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Function to generate mock AI responses
  const generateAIResponse = (
    message: string,
    params: TripParameters
  ): string => {
    // TODO: Implement AI response generation with OpenAI API
    // The updated parameters are automatically passed in here,
    // so the AI responses can take into account the current parameters
    return "";
  };

  // Add a welcome message ONLY when the component first mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      const destinationName = tripParameters.location;

      const welcomeMessage: ChatMessageType = {
        id: uuidv4(),
        text: destinationName
          ? `Welcome to your travel planner! I see you're interested in visiting ${destinationName}. Let me help you plan your perfect vacation.`
          : "Welcome to your travel planner! Start by setting your trip parameters, then ask me to help you plan your perfect vacation.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      hasInitialized.current = true;
    }
  }, [tripParameters.location]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        margin: 0,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header with trip title and parameters */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          New Trip
        </Typography>

        {/* Compact trip parameters in the center */}
        <CompactTripParameters
          parameters={tripParameters}
          onParametersChange={handleParameterChange}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<SaveIcon />}>
            Save to Dashboard
          </Button>
          <Button variant="outlined" size="small" startIcon={<ShareIcon />}>
            Share
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Grid
        container
        spacing={0}
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          m: 0,
          width: "100%",
        }}
      >
        {/* Itinerary Panel */}
        <Grid item xs={12} md={6} sx={{ height: "100%", pr: 1 }}>
          <Paper
            elevation={2}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" component="h2">
                Trip Itinerary
              </Typography>
              <IconButton size="small">
                <AddIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 0,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(30, 30, 30, 0.6)"
                    : "#f8f9fa",
                display: "flex",
                flexDirection: "column",
                "& > *:last-child": {
                  marginTop: "auto",
                },
              }}
            >
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={6} sx={{ height: "100%", pl: 1 }}>
          <MapIntegration
            location={tripParameters.location || ""}
            onLocationSelect={(loc) => handleParameterChange({ location: loc })}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTripPage;
