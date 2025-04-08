import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, FormEvent } from "react";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/user/register", {
        username,
        email,
        password,
      });

      console.log("register-form-result:", result);
      console.log("register-response-status:", result.status);

      if (result.status === 201) {
        alert("Successfully registered! Now login.");
        navigate("/login");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("An error occurred registering with these credentials");
        console.log("register-error");
      }
    }
  };

  return (
    <div>
      <h2>Register Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email</label>
        <input
          type="text"
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

        <button
          type="submit"
          style={{ color: "black", fontWeight: "bold" }}
        >
          Create Account & Register!
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
