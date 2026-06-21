const mongoose = require('mongoose');

const MacroSchema = new mongoose.Schema({
  protein: { type: Number, default: 30 },
  carbs: { type: Number, default: 40 },
  fats: { type: Number, default: 30 },
});

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  goal: { type: String, enum: ['weight_loss','maintenance','muscle_gain'], default: 'maintenance' },
  calorieBaseline: { type: Number, default: 2000 },
  dailyCalorieTarget: { type: Number, default: 2000 },
  macroRatios: { type: MacroSchema, default: undefined },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (!this.dailyCalorieTarget) this.dailyCalorieTarget = this.calorieBaseline;
  if (!this.macroRatios) this.macroRatios = { protein: 30, carbs: 40, fats: 30 };
  next();
});

module.exports = mongoose.model('User', UserSchema);
