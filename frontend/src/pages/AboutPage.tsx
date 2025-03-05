import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Title */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        About AI Travel Planner
      </Typography>

      {/* Our Story Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph>
          AI Travel Planner was born from a simple idea: planning a trip should
          be as enjoyable as the trip itself. Our founders, avid travelers
          themselves, were frustrated with the time-consuming and often
          stressful process of planning vacations. They envisioned a tool that
          could harness the power of artificial intelligence to create
          personalized travel experiences.
        </Typography>
        <Typography variant="body1" paragraph>
          Launched in 2025, our platform combines cutting-edge AI technology
          with a deep understanding of travel to deliver customized itineraries
          that match your preferences, budget, and travel style. Whether you're
          seeking a beach retreat, an urban adventure, or an off-the-beaten-path
          experience, our AI Travel Planner is designed to make your journey
          seamless from the planning stage to your return home.
        </Typography>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Our Values Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          What Sets Us Apart
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <Avatar
                sx={{ bgcolor: "primary.main", width: 60, height: 60, mb: 2 }}
              >
                <ExploreIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  align="center"
                  gutterBottom
                >
                  Personalized Experiences
                </Typography>
                <Typography variant="body2" align="center">
                  Our AI analyzes your preferences to create truly customized
                  travel plans that match your unique style and interests.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <Avatar
                sx={{ bgcolor: "primary.main", width: 60, height: 60, mb: 2 }}
              >
                <AutoAwesomeIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  align="center"
                  gutterBottom
                >
                  Smart Recommendations
                </Typography>
                <Typography variant="body2" align="center">
                  Discover hidden gems and local favorites with our intelligent
                  recommendation system that goes beyond typical tourist spots.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <Avatar
                sx={{ bgcolor: "primary.main", width: 60, height: 60, mb: 2 }}
              >
                <SupportAgentIcon fontSize="large" />
              </Avatar>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  align="center"
                  gutterBottom
                >
                  Dedicated Support
                </Typography>
                <Typography variant="body2" align="center">
                  Our team of travel experts is always ready to assist you,
                  ensuring your travel planning experience is smooth and
                  enjoyable.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Mission Statement */}
      <Box sx={{ bgcolor: "primary.light", p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" align="center">
          To transform travel planning from a tedious task into a delightful
          experience by leveraging AI technology, making personalized travel
          accessible to everyone regardless of budget or destination.
        </Typography>
      </Box>
    </Container>
  );
}
