import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/User";
import express, { Router, Request, Response } from "express";
import { hashPassword, verifyPassword } from "../Functions/Password"; // Ensure correct import
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { client } from '../config/google';


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

// Secret key for signing JWTs
const secretKey = 'prav-is-cool';

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
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        res.json({ token, message:"user successfully logged in", redirect_now: true });
      }

    }

  } catch (error) {
    res.status(500).json({ error: "Error logining user" });
  }
}

interface RefreshTokenBody {
  token: string;
}

export const refreshTokenController = async (req: Request<{}, {}, RefreshTokenBody>, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Verify the existing token
    const decoded = jwt.verify(token, secretKey) as { email: string };
    
    // Generate a new token
    const newToken = jwt.sign({ email: decoded.email }, secretKey, { expiresIn: '1h' });
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid token", message: "Token is invalid or expired" });
  }
};

interface GoogleLoginBody {
  credential: string;
}

export const googleLoginController = async (req: Request<{}, {}, GoogleLoginBody>, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '516075917073-kjqp5cjgsn2jl5a3bgijeh8r0bfefvkv.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ error: "Invalid token", message: "Could not verify Google token" });
      return;
    }

    const { email, name } = payload;

    // Find or create user
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new UserModel({
        email,
        username: name || email?.split('@')[0],
        password: '', // Google users don't need a password
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.json({ token, message: "Google login successful", redirect_now: true });

  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(500).json({ error: "Error during Google login", message: "Failed to process Google login" });
  }
};