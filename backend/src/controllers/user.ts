import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/User";
import express, { Router, Request, Response } from "express";
import { hashPassword } from "../Functions/Password"; // Ensure correct import


interface RegisterBody {
    username: string,
    email: string,
    password: string,
}

export const registerController = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body;
      console.log("u:  " + username +" e: " + email + " p: " + password);
      const existingUser = await UserModel.findOne({ email });
  
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
      }
  
     const hashedPassword = await hashPassword(password);
      const newUser = new UserModel({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Error in register route:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  };