import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { sign } = jwt;

const incryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    const isUsernameOrEmailInUse = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUsernameOrEmailInUse) {
      return res.status(400).json({
        success: false,
        message:
          "Username or email already in use. Please try again with available data.",
      });
    }

    const hashPassword = await incryptPassword(password);

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
  } catch (error) {
    console.error("Something went wrong ->", error);
    res.status(500).json({
      success: false,
      message: "Could not complete user registration. Please try again",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: `Could not find user ${username}. Please try again.`,
      });
    }

    const hasMatchingPasswords = await comparePasswords(
      password,
      foundUser.password
    );

    if (!hasMatchingPasswords) {
      return res.status(403).json({
        success: false,
        message: "Passwords don't macth. Please try again.",
      });
    }

    const accessToken = sign(
      {
        userId: foundUser._id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15d" }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully logged in!",
      accessToken,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    res.status(500).json({
      success: false,
      message: "Could not complete user login. Please try again",
    });
  }
};

export { loginUser, registerUser };
