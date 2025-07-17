import { Request, Response } from "express";
import fs from "fs";
import { deleteImage, uploadImage } from "../helpers/cloudinary-helper.js";
import Recipe from "../models/Recipe.js";

interface FetchRequest extends Request {
  query: {
    page: string;
    limit: string;
    sortBy?: "createdAt" | "updatedAt" | "title" | "instructions";
    sortByOrder?: "asc" | "desc";
  };
}

const fetchAllRecipes = async (req: FetchRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortByOrder = req.query.sortByOrder === "asc" ? 1 : -1;

    const totalRecipes = await Recipe.countDocuments();
    const totalPages = Math.ceil(totalRecipes / limit);

    const sortStr = `${sortByOrder === 1 ? "" : "-"}${sortBy}`;

    const recipes = await Recipe.find().sort(sortStr).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched user recipes.",
      currentPage: page,
      totalPages,
      totalRecipes,
      data: recipes,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch recipes. Please try again.",
    });
  }
};

const fetchRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const foundRecipe = await Recipe.findById(id);

    if (!foundRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe ${id} don't exist.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Recipe was successfully found.`,
      data: foundRecipe,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch recipe. Please try again.",
    });
  }
};

const fetchRecipesByUserId = async (req: FetchRequest, res: Response) => {
  try {
    const { userId } = req.userInfo;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortByOrder = req.query.sortByOrder === "asc" ? 1 : -1;

    const query = {
      publisherId: userId,
    };

    const totalRecipes = await Recipe.find(query).countDocuments();
    const totalPages = Math.ceil(totalRecipes / limit);

    const sortStr = `${sortByOrder === 1 ? "" : "-"}${sortBy}`;

    const recipes = await Recipe.find(query)
      .sort(sortStr)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched user recipes.",
      currentPage: page,
      totalPages,
      totalRecipes,
      data: recipes,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch recipe. Please try again.",
    });
  }
};

const deleteRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const foundRecipe = await Recipe.findById(id);

    // Recipe not found
    if (!foundRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe ${id} could not be found. Please try again with valid data.`,
      });
    }

    // Delete from cloudinary if recipe has image
    if (foundRecipe.imagePublicId) {
      await deleteImage(foundRecipe.imagePublicId);
    }

    foundRecipe.deleteOne();
    await foundRecipe.save();

    return res.status(200).json({
      success: true,
      message: `Recipe ${id} was successfully deleted.`,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not delete recipe. Please try again.",
    });
  }
};

const updateRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, instructions, ingredients, nutrition } = req.body;

    let imageUrl: string = "";
    let imagePublicId: string = "";

    const foundRecipe = await Recipe.findById(id);

    if (!foundRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe ${id} could not be found. Please try again with valid data.`,
      });
    }

    // If there is a new image
    if (req.file) {
      // Delete previous image
      if (foundRecipe.imagePublicId) {
        await deleteImage(foundRecipe.imagePublicId);
      }

      const result = await uploadImage(req.file.path);
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
      $set: {
        title: title || foundRecipe.title,
        instructions: instructions || foundRecipe.instructions,
        ingredients:
          ingredients === undefined
            ? foundRecipe.ingredients
            : JSON.parse(ingredients),
        nutrition:
          nutrition === undefined
            ? foundRecipe.nutrition
            : JSON.parse(nutrition),
        imagePublicId: imagePublicId || foundRecipe.imagePublicId,
        imageUrl: imageUrl || foundRecipe.imageUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Recipe was successfully updated.",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not update recipe. Please try again.",
    });
  }
};

const createNewRecipe = async (req: Request, res: Response) => {
  try {
    const { title, instructions, nutrition, ingredients } = req.body;

    let imageUrl: string = "";
    let imagePublicId: string = "";

    if (req.file) {
      const result = await uploadImage(req.file.path);

      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const newRecipe = await Recipe.create({
      title,
      ingredients: JSON.parse(ingredients),
      instructions,
      nutrition: JSON.parse(nutrition),
      imageUrl: imageUrl || null,
      imagePublicId: imagePublicId || null,
      publisherId: req.userInfo.userId,
    });

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (newRecipe) {
      return res.status(201).json({
        success: true,
        message: "Recipe was successfully created!",
        data: newRecipe,
      });
    }
  } catch (error) {
    console.error("Something went wrong ->", error);
    return res.status(500).json({
      success: false,
      message: "Could not create recipe. Please try again.",
    });
  }
};

export {
  createNewRecipe,
  deleteRecipeById,
  fetchAllRecipes,
  fetchRecipeById,
  fetchRecipesByUserId,
  updateRecipeById,
};
