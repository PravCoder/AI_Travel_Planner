import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ChatInterface, { ChatMessageType } from "../components/ChatInterface";
import TripParameters, {
  TripParametersData,
} from "../components/TripParameters";
import ItineraryDrawer from "../components/ItineraryDrawer";
import MapIntegration from "../components/MapIntegration";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:3001"; // Use localhost for development

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
  const chatHistoryRef = useRef<Array<{ role: string; content: string }>>([]);

  // get the trip-id-url parameter from the url
  const { tripID } = useParams<{ tripID: string }>();

  // Trip parameters state - initialize with URL param if available
  const [tripParameters, setTripParameters] = useState<TripParametersData>({
    location: searchParams.get("destination") || "",
    tripType: "",
    startDate: null,
    endDate: null,
    budget: "medium",
    travelers: 1,
  });

  // Load trip data if tripID is provided
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        if (!tripID) return;

        console.log("Fetching trip data for ID:", tripID);
        const response = await axios.get(
          `${API_BASE_URL}/trip/get-days-from-trip/${tripID}` // when page is refreshed get the trip-object & the returned data should be the trip-obj converted into days format, which is passed into ItineraryDrawer.tsx
        );
        const tripData = response.data;

        console.log("Trip data loaded:", tripData);

        // Update trip parameters with loaded data
        setTripParameters({
          location: tripData.city || tripData.country || "",
          tripType: tripData.tripType || "",
          startDate: tripData.startDate ? new Date(tripData.startDate) : null,
          endDate: tripData.endDate ? new Date(tripData.endDate) : null,
          budget: tripData.budget || "medium",
          travelers: tripData.numTravelers || 1,
        });

        // If there is OpenAI-generated data, set it as tripPlan
        if (tripData.destination && tripData.days) {
          setTripPlan(tripData);
        }
        setTripPlan(tripData);
      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    fetchTripData();
  }, [tripID]);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: might want to allow the chatbot to modify trip parameters if it gains new info through the chat
  // (e.g., if the user mentions a specific date or budget preference that differs from the initial input)

  // Itinerary drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<"left" | "right">("right");
  const [tripPlan, setTripPlan] = useState<any>(null);

  // Function to collapse sidebar - this will be passed to the ItineraryDrawer
  const handleCollapseSidebar = () => {
    // This function will need to communicate with the app layout/sidebar component
    // We'll use a custom event to trigger the sidebar collapse
    const event = new CustomEvent("collapse-sidebar");
    window.dispatchEvent(event);

    console.log("Collapsing sidebar for better drawer visibility");
  };

  // Handle parameter changes
  const handleParameterChange = (newParams: Partial<TripParametersData>) => {
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

  const handleSaveTrip = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trip/save`, {
        tripParameters,
      });
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  // Format trip plan for display in chat
  const formatTripPlan = useCallback((tripPlan: any) => {
    if (!tripPlan || !tripPlan.days) return "No trip details available.";

    let formatted = "";

    // Add day-by-day itinerary
    tripPlan.days.forEach((day: any) => {
      formatted += `\n\n### ${day.date}\n`;

      day.activities.forEach((activity: any) => {
        formatted += `\n- **${activity.name}**: ${activity.description}`;
      });

      if (day.notes) {
        formatted += `\n\n*Notes: ${day.notes}*`;
      }
    });

    return formatted;
  }, []);

  // Generate trip plan when ready
  const generateTripPlan = useCallback(async () => {
    if (!tripParameters.location) {
      // Add message if location is missing
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        text: "I need a destination to create a trip plan. Please set your location.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsLoading(true);

    // Add a loading message
    const loadingMessage: ChatMessageType = {
      id: uuidv4(),
      text: `Generating your trip plan for ${tripParameters.location}...`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Extract conversation context from chat history
      const conversationContext = chatHistoryRef.current.map(
        (msg) => msg.content
      );

      // Call the backend to generate trip plan -IMPORTANT
      const response = await axios.post(`${API_BASE_URL}/trip/generate`, {
        tripParameters,
        conversationContext,
        tripID
      });

      // Process the trip plan response
      console.log("Generated trip plan:", response.data);

      // Store the trip plan data in state
      setTripPlan(response.data);

      // Add success message
      const successMessage: ChatMessageType = {
        id: uuidv4(),
        text: `Your trip plan for ${tripParameters.location} is ready! Here's what I've prepared:`,
        sender: "ai",
        timestamp: new Date(),
      };

      // Add plan details message
      const tripSummaryMessage: ChatMessageType = {
        id: uuidv4(),
        text: `**Trip Summary:** ${response.data.summary}\n\n${formatTripPlan(
          response.data
        )}`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, successMessage, tripSummaryMessage]);

      // Open the itinerary drawer to show the plan
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error generating trip plan:", error);

      // Add error message - DEMO
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        text: "Sorry, I encountered an error generating your trip plan. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [tripParameters, formatTripPlan]);

  // Handle sending a message
  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Update chat history with user message
    chatHistoryRef.current.push({ role: "user", content: messageText });

    try {
      // Check if we should directly generate a plan (trigger words in user message)
      const planCommandRegex =
        /(create|generate|make|show|give me).*(plan|itinerary|trip|schedule)/i;
      const directPlanRequest = planCommandRegex.test(messageText);

      // Only proceed with trip generation if we have at least a location or trip type
      const canGeneratePlan =
        directPlanRequest &&
        (tripParameters.location || tripParameters.tripType);

      if (canGeneratePlan) {
        // Skip AI response and directly generate the plan
        await generateTripPlan();
        setIsLoading(true);
        return;
      }

      // Regular chat flow -IMPORTANT
      const response = await axios.post(`${API_BASE_URL}/trip/chat`, {
        message: messageText,
        tripParameters,
        chatHistory: chatHistoryRef.current,
      });

      // Extract AI response
      const aiResponseText = response.data.reply;
      const commandDetected = response.data.commandDetected;

      // Check if the AI detected a command to generate a plan
      if (
        commandDetected &&
        (tripParameters.location || tripParameters.tripType)
      ) {
        // AI detected a plan generation command and we have minimum requirements - IMPORTANT
        await generateTripPlan();
      } else {
        // Add AI response message
        const aiMessage: ChatMessageType = {
          id: uuidv4(),
          text: aiResponseText,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Update chat history with AI response
        chatHistoryRef.current.push({
          role: "assistant",
          content: aiResponseText,
        });
      }
    } catch (error: any) {
      console.error("Error getting AI response:", error);

      // Add error message with specific error details if available
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        text:
          error.response?.data?.error ||
          "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

      // Initialize chat history
      chatHistoryRef.current = [
        { role: "assistant", content: welcomeMessage.text },
      ];

      hasInitialized.current = true;
    }
  }, [tripParameters.location]);

  // Handle toggle drawer open/close
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle drawer position change from the drawer component
  const handleDrawerSideChange = (side: "left" | "right") => {
    setDrawerSide(side);
  };

  console.log("tripPlan passed to ItineraryDrawer: \n", tripPlan);

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
        position: "relative",
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
          position: "relative",
          zIndex: 10,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          {tripID ? "Edit Trip" : "New Trip"}{" "}
          {tripID ? `#${tripID.slice(-6)}` : ""}
        </Typography>

        {/* Trip parameters in the center */}
        <TripParameters
          parameters={tripParameters}
          onParametersChange={handleParameterChange}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<SaveIcon />}>
            Save
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
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Itinerary Panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: "100%",
            pr: 1,
            position: "relative",
          }}
        >
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
              <Button
                variant="contained"
                size="small"
                onClick={toggleDrawer}
                startIcon={<FormatListBulletedIcon />}
              >
                {"Itinerary"}
              </Button>
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
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: "100%",
            pl: 1,
            display: {
              xs: drawerOpen && drawerSide === "right" ? "none" : "block",
              md: "block",
            },
          }}
        >
          <MapIntegration
            location={tripParameters.location || ""}
            onLocationSelect={(loc) => handleParameterChange({ location: loc })}
            itineraryDays={
              tripPlan?.days
                ? tripPlan.days.map((day) => ({
                    date: day.date,
                    locations: day.activities.map((activity) => ({
                      name: activity.name,
                      location:
                        activity.location ||
                        tripPlan.destination ||
                        tripParameters.location ||
                        "",
                      description: activity.description,
                      time: activity.time,
                      category: activity.category,
                    })),
                  }))
                : []
            }
          />
        </Grid>
      </Grid>

      {/* Itinerary Drawer - overlays the content */}
      <ItineraryDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        tripParameters={tripParameters}
        onSideChange={handleDrawerSideChange}
        onCollapseSidebar={handleCollapseSidebar}
        tripPlan={tripPlan}
      />
    </Box>
  );
};

export default CreateTripPage;
