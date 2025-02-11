import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the user document (extends Mongoose's Document)
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// Hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
