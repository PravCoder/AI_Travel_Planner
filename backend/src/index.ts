// currently  not used, index.js includes all routers
import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const app = express();
const router = express.Router();  // base-router
app.use(express.json());
app.use(cors());

// Import routers
import userRouter from "./routes/user_routes";  // impor user-router
app.use("/", router);
app.use("/user", userRouter); // include user-router routes all user-router-routes ahve prefix /user



// connection string with db-password db-name, password is leaked here, also manually have to put db-name here after .net/
mongoose
  .connect(
    'mongodb+srv://admin:djbeg123*@aitravelplannercluster.96bpw.mongodb.net/?retryWrites=true&w=majority&appName=aitravelplannercluster'
  )
  .then(() => console.log('Connected to MongoDB index.ts: '))
  .catch((err: Error) => console.log('Error connecting to MongoDB:', err));

// confirm server is running
app.listen(3001, () => {
  console.log('server is running');
});

// our api endpoint that is requested by frontend, handle logic here, sends response with data back to frontend for displaying
router.post('/test', async (req: Request, res: Response) => {
  try {
    const {} = req.body;

    // return some data in our response to the reqest.
    res.status(201).json({
      message: 'test successfully created',
      test_data: 'testing 123..',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'unable to test, error: error.messag' });
  }
});
