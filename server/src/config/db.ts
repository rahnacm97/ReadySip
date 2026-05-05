import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env["MONGO_URI"];
    if (!mongoUri) throw new Error("MONGO_URI is not defined in .env");

    console.log("📡 Attempting to connect to MongoDB...");

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error: unknown) {
    console.error("❌ MongoDB connection failed:");
    if (
      error instanceof Error &&
      error.name === "MongooseServerSelectionError"
    ) {
      console.error(
        "👉 Suggestion: Your network might be blocking port 27017. Try using a Mobile Hotspot.",
      );
    }
    console.error(
      "Error Details:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
};

export default connectDB;
