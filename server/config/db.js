import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log(`⚠️ MONGO_URI not found in environment variables. Running in demo mode with mock data.`);
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      console.log(`✅ Connected to MongoDB database: ${mongoose.connection.name}`);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`⚠️ Running in demo mode with mock data.`);
    // Continue running in demo mode instead of exiting
  }
};

export default connectDB;
