/*  Create backend endpoints related to user model here, like /login & /register  

1. Need to create a express router called userRouter or something, create a /login endpoint, export that router, and import it in index.js
2. In index.js import this userRouter and do app.use("/", userRouter);, so you can send requests to the endpoints in this file and test your code.
*/

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const userRouter = express.Router(); // create a express-router-instance



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

export default userRouter;

