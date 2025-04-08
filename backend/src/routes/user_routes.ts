import express, { Router, Request, Response } from "express";
import { hashPassword } from "../Functions/Password"; // Ensure correct import
import UserModel from "../models/User"; // Ensure correct model import

// create router
const userRouter: Router = express.Router(); // Explicitly defining Router type

// import controllers
import * as UserController from "../controllers/user";

/**
 * Register Route
*/
userRouter.post("/register", UserController.registerController);

/**
 * Login Route
*/
userRouter.post("/login", UserController.loginController);

/**
 * Google Login Route
*/
userRouter.post("/google-login", UserController.googleLoginController);

/**
 * Refresh Token Route
*/
userRouter.post("/refresh-token", UserController.refreshTokenController);

/*
 * POSTMAN REQUEST URL: http://localhost:3001/user/register
 * JSON BODY:
 * {
 *   "username": "testUser",
 *   "email": "test@example.com",
 *   "password": "SecurePass123"
 * }
 */

export { userRouter };
