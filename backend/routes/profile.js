const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { calculateDailyTarget } = require('../utils/calc');

router.get('/', auth, async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/', auth, async (req,res) => {
  const { goal, calorieBaseline, macroRatios } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (goal) user.goal = goal;
    if (calorieBaseline) user.calorieBaseline = calorieBaseline;
    if (macroRatios) user.macroRatios = macroRatios;
    user.dailyCalorieTarget = calculateDailyTarget(user.calorieBaseline, user.goal);
    await user.save();
    res.json(user);
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
