import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
  ],
  (async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() });
        return;
      }

      const { email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const newUser = new User({ email, password, firstName, lastName });
      await newUser.save();

      const token = jwt.sign({ userId: newUser.id },
         process.env.JWT_SECRET_KEY as string, 
         {
        expiresIn: "1d",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).send({message:"User registered OK"});
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  })
);

export default router;