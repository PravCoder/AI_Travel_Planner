import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TestPage from "./pages/TestPage";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="516075917073-kjqp5cjgsn2jl5a3bgijeh8r0bfefvkv.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/test" element={<TestPage/>} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
