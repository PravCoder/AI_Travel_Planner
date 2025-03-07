"use strict";
/*  Create backend endpoints related to user model here, like /login & /register

1. Need to create a express router called userRouter or something, create a /login endpoint, export that router, and import it in index.js
2. In index.js import this userRouter and do app.use("/", userRouter);, so you can send requests to the endpoints in this file and test your code.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router(); // create a express-router-instance
;
userRouter.post("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { form_input1, form_input2 } = req.body; // breakdown inputs we recived with the request body
    // do your endpoint logic here
    console.log("Test Endpoint Data we recvied from frontend form: " + form_input1 + ", " + form_input2);
    const random_number = Math.random(); // just get a random number and send it back to frontend in the response-json-body
    res.status(201).json({ message: "test endpoint was successful", additional_data: random_number }); // send response back to client with a message or additional data
}));
exports.default = userRouter;
