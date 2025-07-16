import "dotenv/config";
import express from "express";
import connectToDatabase from "./database/db.js";
import authRouter from "./routes/auth-routes.js";
const app = express();

// Connect database
connectToDatabase();

// Use express JSON middleware
app.use(express.json());

// Use routes
app.use("/api/auth", authRouter);

// Listen to port
const PORT = process.env.MONGO_URI || 3000;
app.listen(PORT, () => console.log("App is now listening on port 3000"));
