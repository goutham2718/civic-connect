import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};