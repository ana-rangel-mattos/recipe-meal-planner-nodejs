import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User.js";

const incryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const registerUser = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("Something went wrong ->", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
  const { name, username, email, password } = req.body;

  const hashPassword = incryptPassword(password);

  const newUser = new User({
    name,
    username,
    email,
    password: hashPassword,
  });
  await newUser.save();

  res.status(201).json({
    success: true,
    message: "User created successfully!",
  });
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
};

export { loginUser, registerUser };
