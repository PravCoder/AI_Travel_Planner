/*  Create backend endpoints related to user model here, like /login & /register  

1. Need to create a express router called userRouter or something, create a /login endpoint, export that router, and import it in index.js
2. In index.js import this userRouter and do app.use("/", userRouter);, so you can send requests to the endpoints in this file and test your code.
*/

/* 
The interface is just defining the structure of the body of the request that the endpoint recives from the request.
Postman-url: http://localhost:3001/user/test
Postman-request-body: 
{
  "form_input1": "Apple",
  "form_input2": "Orange"
}
*/

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from '../models/User';

const userRouter = express.Router(); // create a express-router-instance

// Define interfaces 
interface RegisterRequestBody {username: string; email: string; password: string}
interface LoginRequestBody {username: string;  email: string; password: string}


//TEST TEST TEST TEST
interface TestRequestBody {form_input1: string; form_input2: string};
userRouter.post("/test", async (req: Request<{}, {}, TestRequestBody>, res: Response) => {  // this accepts a post-request to /test endpoint and does some logic

    const {form_input1, form_input2} = req.body;  // breakdown inputs we recived with the request body

    // do your endpoint logic here
    console.log("Test Endpoint Data we recvied from frontend form: " + form_input1 + ", " +form_input2);
    const random_number = Math.random(); // just get a random number and send it back to frontend in the response-json-body

    res.status(201).json({message: "test endpoint was successful", additional_data: random_number}); // send response back to client with a message or additional data

});

// User /register endpoint
userRouter.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Check to see if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create a new user
        const newUser = new User({ username, email, password });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

// User /login endpoint
userRouter.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

export default userRouter;