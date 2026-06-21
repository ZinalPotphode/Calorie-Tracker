const mongoose = require('mongoose');

const Per100Schema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
});

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  per100: { type: Per100Schema, required: true },
  notes: String
});

module.exports = mongoose.model('Food', FoodSchema);
