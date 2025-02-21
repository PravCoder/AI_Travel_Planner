/*  Create backend endpoints related to user model here, like /login & /register  

1. Need to create a express router called userRouter or something, create a /login endpoint, export that router, and import it in index.js
2. In index.js import this userRouter and do app.use("/", userRouter);, so you can send requests to the endpoints in this file and test your code.
*/

import express, { Request, Response, Router } from "express";
import { hashPassword, verifyPassword } from '../Functions/Password';
import UserModel from '../models/User';
import mongoose from "mongoose";
import cors from "cors";

const userRouter: Router = express.Router();
 // create a express-router-instance



/* 
The interface is just defining the structure of the body of the request that the endpoint recives from the request.
Postman-url: http://localhost:3001/user/test
Postman-request-body: 
{
  "form_input1": "Apple",
  "form_input2": "Orange"
}
*/
interface TestRequestBody {form_input1: string; form_input2: string};

userRouter.post("/test", async (req: Request<{}, {}, TestRequestBody>, res: Response) => {  // this accepts a post-request to /test endpoint and does some logic

    const {form_input1, form_input2} = req.body;  // breakdown inputs we recived with the request body

    // do your endpoint logic here
    console.log("Test Endpoint Data we recvied from frontend form: " + form_input1 + ", " +form_input2);
    const random_number = Math.random(); // just get a random number and send it back to frontend in the response-json-body

    res.status(201).json({message: "test endpoint was successful", additional_data: random_number}); // send response back to client with a message or additional data

});



/**
 * Register Route
 */
interface RegisterRequestBody { userName: string; email: string; passWord: string };

userRouter.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
      const { userName, email, passWord } = req.body;

      // Check if the user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(passWord);

      // Create a new user
      const newUser = new UserModel({ userName, email, passWord: hashedPassword });
      await newUser.save();

      return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
      console.error("Error in register route:", error);
      return res.status(500).json({ error: "Error registering user" });
  }
});

export default userRouter;

