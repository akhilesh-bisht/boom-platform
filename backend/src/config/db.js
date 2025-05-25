import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connectionDb.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
