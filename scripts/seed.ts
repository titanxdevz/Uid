import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://harmonia:anshop@ac-mfkkcv8-shard-00-00.nxprk5x.mongodb.net:27017,ac-mfkkcv8-shard-00-01.nxprk5x.mongodb.net:27017,ac-mfkkcv8-shard-00-02.nxprk5x.mongodb.net:27017/?ssl=true&replicaSet=atlas-e9gz7x-shard-0&authSource=admin&appName=harmonia";
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const User = mongoose.models.User ?? mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    credits: { type: Number, default: 0, min: 0 },
    creditsUsed: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const existing = await User.findOne({ email: "admin@uid.local" });
  if (existing) {
    console.log("Admin user already exists, skipping seed.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash("admin123", 12);

  await User.create({
    name: "Admin",
    email: "admin@uid.local",
    password: hashed,
    role: "admin",
    credits: 1000,
  });

  console.log("Admin user seeded successfully (admin@uid.local / admin123)");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
