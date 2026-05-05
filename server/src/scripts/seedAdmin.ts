import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ADMIN = {
  name: "ReadySip Admin",
  email: "admin@readysip.com",
  phone: "9999999999",
  password: "Admin@1234",
  role: "admin" as const,
  isVerified: true,
};

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in .env");

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`⚠️  Admin already exists (${ADMIN.email}). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const admin = new User(ADMIN);
  await admin.save();
  console.log("🎉 Admin created!");
  console.log(`   Email   : ${ADMIN.email}`);
  console.log(`   Password: ${ADMIN.password}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
