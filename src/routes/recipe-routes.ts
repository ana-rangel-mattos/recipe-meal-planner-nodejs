import express from "express";
import {
  createNewRecipe,
  deleteRecipeById,
  fetchAllRecipes,
  fetchRecipeById,
  fetchRecipesByUserId,
  updateRecipeById,
} from "../controllers/recipe-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import multerMiddleware from "../middlewares/multer-middleware.js";

const recipeRouter = express.Router();

recipeRouter.get("/all-recipes", authMiddleware, fetchAllRecipes);
recipeRouter.get("/user-recipes", authMiddleware, fetchRecipesByUserId);
recipeRouter.get("/:id", authMiddleware, fetchRecipeById);
recipeRouter.post(
  "/new",
  authMiddleware,
  multerMiddleware.single("image"),
  createNewRecipe
);
recipeRouter.put(
  "/:id",
  authMiddleware,
  multerMiddleware.single("image"),
  updateRecipeById
);
recipeRouter.delete("/:id", authMiddleware, deleteRecipeById);

export default recipeRouter;
