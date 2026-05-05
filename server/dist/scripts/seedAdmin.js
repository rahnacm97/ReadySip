"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const ADMIN = {
    name: "ReadySip Admin",
    email: "admin@readysip.com",
    phone: "9999999999",
    password: "Admin@1234",
    role: "admin",
    isVerified: true,
};
async function seed() {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error("MONGO_URI not set in .env");
    await mongoose_1.default.connect(uri);
    console.log("✅ Connected to MongoDB");
    const existing = await User_1.default.findOne({ email: ADMIN.email });
    if (existing) {
        console.log(`⚠️  Admin already exists (${ADMIN.email}). Skipping.`);
        await mongoose_1.default.disconnect();
        return;
    }
    const admin = new User_1.default(ADMIN);
    await admin.save();
    console.log("🎉 Admin created!");
    console.log(`   Email   : ${ADMIN.email}`);
    console.log(`   Password: ${ADMIN.password}`);
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
//# sourceMappingURL=seedAdmin.js.map