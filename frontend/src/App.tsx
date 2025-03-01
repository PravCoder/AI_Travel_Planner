import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayoutBasic from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import "./styles/global.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayoutBasic />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
