import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import { CustomThemeProvider } from "./context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";

// Placeholder components for routes
const About = () => <div>About Content</div>;
const Reports = () => <div>Reports Content</div>;
const Sales = () => <div>Sales Reports Content</div>;
const Traffic = () => <div>Traffic Reports Content</div>;
const Integrations = () => <div>Integrations Content</div>;

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="about" element={<About />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/sales" element={<Sales />} />
            <Route path="reports/traffic" element={<Traffic />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
