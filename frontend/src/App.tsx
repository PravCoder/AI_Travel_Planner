import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import { CustomThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import CreateTripPage from "./pages/CreateTripPage";
import PopularDestinationsPage from "./pages/PopularDestinationsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <GoogleOAuthProvider clientId="516075917073-kjqp5cjgsn2jl5a3bgijeh8r0bfefvkv.apps.googleusercontent.com">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* dynamic url for trip-id */}
              <Route path="create-trip/:tripID" element={<CreateTripPage />} />

              <Route path="about" element={<AboutPage />} />

              <Route
                path="popular-destinations"
                element={<PopularDestinationsPage />}
              />
            </Route>
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </CustomThemeProvider>
  );
}

export default App;