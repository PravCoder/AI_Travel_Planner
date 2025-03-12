import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import { CustomThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import CreateTripPage from "./pages/CreateTripPage";
import PopularDestinationsPage from "./pages/PopularDestinationsPage";

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="create-trip" element={<CreateTripPage />} />
            <Route path="about" element={<AboutPage />} />
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
