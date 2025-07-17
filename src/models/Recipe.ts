import mongoose, { model, Schema } from "mongoose";

interface RecipeProps {
  title: string;
  instructions: string;
  ingredients: IngredientsProps[];
  nutrition: NutritionProps[];
  imageUrl: string;
  imagePublicId: string;
  plublisherId: string;
}

interface IngredientsProps {
  name: string;
  quantity: string;
}

interface NutritionProps {
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
}

const nutritionSchema = new Schema(
  {
    calories: {
      type: Number,
      required: [true, "Calories are required."],
      min: 0,
      default: 0,
    },
    proteins: {
      type: Number,
      required: [true, "Proteins are required."],
      min: 0,
      default: 0,
    },
    carbs: {
      type: Number,
      required: [true, "Carbohydrates are required."],
      min: 0,
      default: 0,
    },
    fat: {
      type: Number,
      required: [true, "Fat is required."],
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required."],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Ingredient quantity is required."],
      trim: true,
    },
  },
  { _id: false }
);

const recipeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
  },
  instructions: {
    type: String,
    required: [true, "Intructions are required."],
    trim: true,
  },
  nutrition: nutritionSchema,
  ingredients: [ingredientsSchema],
  imageUrl: {
    type: String,
    trim: true,
  },
  imagePublicId: {
    type: String,
    trim: true,
  },
  publisherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Recipe = model("Recipe", recipeSchema);

export default Recipe;
