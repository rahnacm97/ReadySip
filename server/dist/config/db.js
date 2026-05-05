"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env["MONGO_URI"];
        if (!mongoUri)
            throw new Error("MONGO_URI is not defined in .env");
        console.log("📡 Attempting to connect to MongoDB...");
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:");
        if (error instanceof Error &&
            error.name === "MongooseServerSelectionError") {
            console.error("👉 Suggestion: Your network might be blocking port 27017. Try using a Mobile Hotspot.");
        }
        console.error("Error Details:", error instanceof Error ? error.message : "Unknown error");
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map