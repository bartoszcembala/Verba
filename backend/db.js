import mongoose from "mongoose";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
