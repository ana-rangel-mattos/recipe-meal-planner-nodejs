import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { verify } = jwt;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ").at(1);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please log in into your account.",
    });
  }

  try {
    const decodedToken = verify(token, process.env.JWT_SECRET!);

    req.userInfo = decodedToken;
    next();
  } catch (error) {
    console.error("Something went wrong ->", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export default authMiddleware;
