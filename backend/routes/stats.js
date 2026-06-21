const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');
const mongoose = require('mongoose');

router.get('/', auth, async (req,res) => {
  const date = req.query.date;
  try {
    const start = date ? new Date(date) : new Date();
    start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(start.getDate()+1);
    const totals = await Meal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: null, calories: { $sum: '$calories' }, protein: { $sum: '$protein' }, carbs: { $sum: '$carbs' }, fats: { $sum: '$fats' } } }
    ]);
    res.json(totals[0] || { calories: 0, protein: 0, carbs: 0, fats: 0 });
  } catch(err) {
    console.error(err); res.status(500).send('Server error');
  }
});

module.exports = router;
