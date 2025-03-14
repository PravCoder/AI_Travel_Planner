/*  Define the User class model here. */
import mongoose, { Schema, Document, Model } from "mongoose";



// define the interface for the user schema (User document)
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// define the schema for the user
const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
);

// define the model using the interface and schema
const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);



export default UserModel;