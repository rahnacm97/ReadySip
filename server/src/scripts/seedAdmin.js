const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const ADMIN_EMAIL = "admin@readysip.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME = "ReadySip Admin";
const ADMIN_PHONE = "9999999999";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌  MONGO_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅  Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️   Admin already exists (${ADMIN_EMAIL}). Nothing changed.`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phone: ADMIN_PHONE,
    password: hashed,
    role: "admin",
    isVerified: true,
  });

  console.log("🎉  Admin user created!");
  console.log(`    Email   : ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
