import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import { CustomThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import CreateTripPage from "./pages/CreateTripPage";
import PopularDestinationsPage from "./pages/PopularDestinationsPage";
import ChatPage from "./pages/ChatPage";

import RegisterPage from "./pages/RegisterPage"; 
import LoginPage from "./pages/LoginPage"; 



function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* dynamic url for trip-id */}
            <Route path="create-trip/:tripID" element={<CreateTripPage />} />

            <Route path="chat" element={<ChatPage />} />
            <Route path="about" element={<AboutPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="popular-destinations"
              element={<PopularDestinationsPage />}
            />
          </Route>
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
