const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/gameverse")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "user"], default: "user" },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Default accounts
const defaultAccounts = [
  {
    email: "admin@gameverse.com",
    password: "admin123",
    username: "admin",
    role: "admin",
  },
  {
    email: "editor@gameverse.com",
    password: "editor123",
    username: "editor",
    role: "editor",
  },
  {
    email: "user@gameverse.com",
    password: "user123",
    username: "user",
    role: "user",
  },
];

async function resetAndSeed() {
  try {
    console.log("🗑️  Deleting existing users...\n");

    // Delete existing default users
    await User.deleteMany({
      email: { $in: defaultAccounts.map((acc) => acc.email) },
    });

    console.log("✅ Deleted old users\n");
    console.log("🌱 Creating new users...\n");

    for (const account of defaultAccounts) {
      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // Create user
      const user = await User.create({
        ...account,
        password: hashedPassword,
      });

      console.log(
        `✅ Created ${account.role.toUpperCase()}: ${account.email} / ${
          account.password
        }`
      );
    }

    console.log("\n🎉 Reset and seed completed successfully!");
    console.log("\n📝 Default Accounts:");
    console.log("   ADMIN:  admin@gameverse.com  / admin123");
    console.log("   EDITOR: editor@gameverse.com / editor123");
    console.log("   USER:   user@gameverse.com   / user123");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
}

// Run
resetAndSeed();
