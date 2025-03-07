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
        console.log("user already exists")
        res.status(400).json({ error: "User already exists", message: "A user with this email already exists"});
        return;
      }
      
      console.log("create new user");
      const hashedPassword = await hashPassword(password);
      const newUser = new UserModel({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!", redirect_now: true });
    } catch (error) {
      console.error("Error in register route:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  };