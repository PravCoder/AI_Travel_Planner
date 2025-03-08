import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/User";
import express, { Router, Request, Response } from "express";
import { hashPassword, verifyPassword } from "../Functions/Password"; // Ensure correct import


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


interface loginBody {
  email: string,
  password: string,
}
export const loginController = async (req: Request<{}, {}, loginBody>, res: Response): Promise<void> => {
  try {

    const {email, password} = req.body;
    console.log("email: " + email + " password: " + password);


    const user = await UserModel.findOne({ email });
    // email doesnt exist
    if (!user) {
      res.status(400).json({ error: "user with email not found", message: "User with that email doesnt exist"});
    } else {
      const passwords_match = await verifyPassword(password, user.password);
      // email does exist passwords dont match
      if (passwords_match == false) {
        res.status(400).json({ error: "user with email found but incorrect password", message: "User with email found but incorrect password"});
      }
      // if email does exist password matches
      else if (passwords_match == true) {
        res.json({userID:user._id, message:"user successfully logged in", redirect_now: true});
      }

    }

  } catch (error) {
    res.status(500).json({ error: "Error logining user" });
  }
}