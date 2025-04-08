import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        email,
        password,
      });

      console.log("login-form result data:", result.data.message);

      // Store userID only
      window.localStorage.setItem("userID", result.data.userID);
      if (result.data.redirect_now) {
        // Store the token in localStorage or a secure cookie
        localStorage.setItem("userID", result.data.userID);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      } 
      navigate("/");
    } catch (error: any) {
      console.error(
        error?.response?.data?.message || "An error occurred during login"
      );
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Login Form</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={{ color: "black", fontWeight: "bold" }}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;