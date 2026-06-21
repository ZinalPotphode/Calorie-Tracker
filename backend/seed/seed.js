const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const Food = require('../models/Food');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const foods = [
  { name: 'Chicken Breast', per100: { calories: 165, protein: 31, carbs: 0, fats: 3.6 } },
  { name: 'White Rice', per100: { calories: 130, protein: 2.4, carbs: 28, fats: 0.3 } },
  { name: 'Avocado', per100: { calories: 160, protein: 2, carbs: 9, fats: 15 } },
  { name: 'Banana', per100: { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 } },
  { name: 'Almonds', per100: { calories: 579, protein: 21, carbs: 22, fats: 50 } }
];

async function seed() {
  await connectDB();
  await Food.deleteMany({});
  await Food.insertMany(foods);
  await User.deleteMany({});
  const password = await bcrypt.hash('password', 10);
  const user = new User({ name: 'Demo User', email: 'demo@example.com', password, calorieBaseline: 2000 });
  user.dailyCalorieTarget = user.calorieBaseline;
  await user.save();
  console.log('Seed complete. Demo user: demo@example.com / password');
  process.exit();
}

seed().catch(err=>{ console.error(err); process.exit(1); });
