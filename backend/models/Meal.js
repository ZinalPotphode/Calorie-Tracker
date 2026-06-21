const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: { type: String, required: true },
  grams: { type: Number, required: true },
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number
}, { timestamps: true });

module.exports = mongoose.model('Meal', MealSchema);
