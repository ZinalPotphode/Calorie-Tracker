const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { scalePer100 } = require('../utils/calc');
const Meal = require('../models/Meal');
const Food = require('../models/Food');
const mongoose = require('mongoose');

router.get('/', auth, async (req,res) => {
  const date = req.query.date;
  try {
    const start = date ? new Date(date) : new Date();
    start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(start.getDate()+1);
    const meals = await Meal.find({ user: req.user.id, createdAt: { $gte: start, $lt: end } }).sort({ createdAt: -1 }).populate('food');
    res.json(meals);
  } catch(err) {
    console.error(err); res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req,res) => {
  const { foodId, name, grams } = req.body;
  if (!grams || grams <= 0) return res.status(400).json({ msg: 'Invalid grams' });
  try {
    let per100;
    let food = null;
    if (foodId) {
      food = await Food.findById(foodId);
      if (!food) return res.status(400).json({ msg: 'Food not found' });
      per100 = food.per100;
    } else if (req.body.per100) {
      per100 = req.body.per100;
    } else {
      return res.status(400).json({ msg: 'No food or per100 provided' });
    }
    const scaled = scalePer100(per100, grams);
    const meal = new Meal({
      user: req.user.id,
      food: food ? food._id : null,
      name: name || (food ? food.name : 'Custom'),
      grams,
      calories: scaled.calories,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fats: scaled.fats
    });
    await meal.save();
    const dateStart = new Date(); dateStart.setHours(0,0,0,0);
    const dateEnd = new Date(dateStart); dateEnd.setDate(dateStart.getDate()+1);
    const totals = await Meal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(meal.user), createdAt: { $gte: dateStart, $lt: dateEnd } } },
      { $group: { _id: null, calories: { $sum: '$calories' }, protein: { $sum: '$protein' }, carbs: { $sum: '$carbs' }, fats: { $sum: '$fats' } } }
    ]);
    res.json({ meal, totals: totals[0] || { calories: 0, protein: 0, carbs: 0, fats: 0 } });
  } catch(err) {
    console.error(err); res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req,res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ msg: 'Meal not found' });
    if (meal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await meal.deleteOne();
    const dateStart = new Date(); dateStart.setHours(0,0,0,0);
    const dateEnd = new Date(dateStart); dateEnd.setDate(dateStart.getDate()+1);
    const totals = await Meal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(meal.user), createdAt: { $gte: dateStart, $lt: dateEnd } } },
      { $group: { _id: null, calories: { $sum: '$calories' }, protein: { $sum: '$protein' }, carbs: { $sum: '$carbs' }, fats: { $sum: '$fats' } } }
    ]);
    res.json({ totals: totals[0] || { calories: 0, protein: 0, carbs: 0, fats: 0 } });
  } catch(err) {
    console.error(err); res.status(500).send('Server error');
  }
});

module.exports = router;
