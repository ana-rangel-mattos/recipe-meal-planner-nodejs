import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Error connecting database ->", error);
  }
};

export default connectToDatabase;
