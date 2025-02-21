import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// Import routers
import userRouter from "./routes/user_routes"; 

const app = express(); // Create Express app
app.use(express.json()); // Ensure JSON parsing
app.use(cors()); // Enable CORS

// Mount routers
app.use("/user", userRouter); // ✅ This is the correct way to mount `userRouter`

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:djbeg123*@aitravelplannercluster.96bpw.mongodb.net/?retryWrites=true&w=majority&appName=aitravelplannercluster"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.log("Error connecting to MongoDB:", err));

// Confirm server is running
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
