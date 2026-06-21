const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

router.get('/', async (req,res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/seed', async (req,res) => {
  try {
    const defaultFoods = [
      { name: 'Chicken Breast', per100: { calories: 165, protein: 31, carbs: 0, fats: 3.6 } },
      { name: 'White Rice', per100: { calories: 130, protein: 2.4, carbs: 28, fats: 0.3 } },
      { name: 'Avocado', per100: { calories: 160, protein: 2, carbs: 9, fats: 15 } },
      { name: 'Banana', per100: { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 } },
      { name: 'Almonds', per100: { calories: 579, protein: 21, carbs: 22, fats: 50 } }
    ];
    await Food.deleteMany({});
    await Food.insertMany(defaultFoods);
    res.json({ msg: 'Seeded foods' });
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
