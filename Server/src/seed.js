require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Record = require("./models/Record");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Analyst User",
    email: "analyst@example.com",
    password: "analyst123",
    role: "analyst",
  },
  {
    name: "Viewer User",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer",
  },
];

const categories = ["Salary", "Freelance", "Rent", "Groceries", "Utilities", "Travel", "Entertainment", "Healthcare"];

const generateRecords = (userIds) => {
  const records = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const isIncome = Math.random() > 0.5;
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));

    records.push({
      amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      type: isIncome ? "income" : "expense",
      category: isIncome
        ? categories[Math.floor(Math.random() * 2)]
        : categories[Math.floor(Math.random() * (categories.length - 2)) + 2],
      date,
      description: `Sample ${isIncome ? "income" : "expense"} entry #${i + 1}`,
      createdBy: userIds[Math.floor(Math.random() * userIds.length)],
    });
  }

  return records;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    await User.deleteMany({});
    await Record.deleteMany({});
    console.log("Cleared existing data");

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    const userIds = createdUsers.map((u) => u._id);
    const records = generateRecords(userIds);
    await Record.insertMany(records);
    console.log(`Created ${records.length} records`);

    console.log("\nSeed accounts:");
    console.log("  admin@example.com    / admin123    (admin)");
    console.log("  analyst@example.com  / analyst123  (analyst)");
    console.log("  viewer@example.com   / viewer123   (viewer)");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
