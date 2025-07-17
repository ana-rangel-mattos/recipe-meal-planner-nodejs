import "dotenv/config";
import express from "express";
import connectToDatabase from "./database/db.js";
import authRouter from "./routes/auth-routes.js";
import recipeRouter from "./routes/recipe-routes.js";
const app = express();

// Connect database
connectToDatabase();

// Use express JSON middleware
app.use(express.json());

// Use routes
app.use("/api/auth", authRouter);
app.use("/api/recipes", recipeRouter);

// Listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is now listening on port ${PORT}`));
