import React, { useEffect, useState } from 'react'
import Api from './api/api'
import GoalToggle from './components/GoalToggle'
import LoggingPanel from './components/LoggingPanel'
import VisualDashboard from './components/VisualDashboard'
import DailyHistory from './components/DailyHistory'
import Login from './components/Login'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [profile, setProfile] = useState(null)
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 })
  const [meals, setMeals] = useState([])
  const [foods, setFoods] = useState([])

  const loadProfile = async () => {
    const p = await Api.getProfile()
    setProfile(p)
  }

  const loadFoods = async () => {
    const f = await Api.getFoods()
    setFoods(f)
  }

  const loadMealsAndTotals = async () => {
    const m = await Api.getMeals()
    setMeals(m)
    const t = await Api.getStats()
    setTotals(t)
  }

  useEffect(() => {
    Api.setToken(token)
    if (token) {
      (async () => {
        await loadProfile()
        await loadFoods()
        await loadMealsAndTotals()
      })()
    }
  }, [token])

  if (!token) {
    return <Login onLogin={(tok)=>{ setToken(tok); localStorage.setItem('token', tok); Api.setToken(tok); }} />
  }

  const handleToggle = async (newGoal) => {
    const updated = await Api.updateProfile({ goal: newGoal })
    setProfile(updated)
    const t = await Api.getStats()
    setTotals(t)
  }

  const handleAddMeal = async (payload) => {
    try {
      const res = await Api.addMeal(payload)
      setMeals(prev => [res.meal, ...prev])
      // normalize totals to numbers
      const t = res.totals || res
      setTotals({
        calories: Number(t.calories || 0),
        protein: Number(t.protein || 0),
        carbs: Number(t.carbs || 0),
        fats: Number(t.fats || 0),
      })
      // ensure consistency with a refresh
      await loadMealsAndTotals()
    } catch (err) {
      console.error('Add meal failed', err)
      alert(err?.response?.data?.msg || err?.message || 'Failed to add meal')
    }
  }

  const handleDeleteMeal = async (id) => {
    try {
      const res = await Api.deleteMeal(id)
      // optimistic UI remove
      setMeals(prev => prev.filter(m => m._id !== id))
      setTotals(res.totals || res)
      // refresh to ensure consistency
      await loadMealsAndTotals()
    } catch (err) {
      console.error('Delete meal failed', err)
      // try to refresh state in case of partial failure
      try { await loadMealsAndTotals() } catch(e){}
      alert(err?.response?.data?.msg || err?.message || 'Failed to delete meal')
    }
  }

  return (
    <div className="app">
      <header className="header"><h1>Calorie Tracker</h1></header>
      <main className="container">
        <GoalToggle goal={profile?.goal} onChange={handleToggle} />
        <VisualDashboard totals={totals} target={profile?.dailyCalorieTarget} macroRatios={profile?.macroRatios} />
        <LoggingPanel foods={foods} onAdd={handleAddMeal} />
        <DailyHistory meals={meals} onDelete={handleDeleteMeal} />
      </main>
    </div>
  )
}
