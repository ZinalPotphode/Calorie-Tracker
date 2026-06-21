const GOAL_MULTIPLIERS = {
  weight_loss: 0.85,
  maintenance: 1.0,
  muscle_gain: 1.15
};

function calculateDailyTarget(baseline, goal) {
  const mult = GOAL_MULTIPLIERS[goal] || 1.0;
  return Math.round(baseline * mult);
}

function scalePer100(per100, grams) {
  const factor = grams / 100;
  return {
    calories: Math.round((per100.calories || 0) * factor),
    protein: +(((per100.protein || 0) * factor).toFixed(1)),
    carbs: +(((per100.carbs || 0) * factor).toFixed(1)),
    fats: +(((per100.fats || 0) * factor).toFixed(1)),
  };
}

module.exports = { calculateDailyTarget, scalePer100 };
