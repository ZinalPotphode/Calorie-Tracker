import React, { useState } from 'react'
import styles from './LoggingPanel.module.css'

export default function LoggingPanel({ foods, onAdd }) {
  const [foodId, setFoodId] = useState('')
  const [name, setName] = useState('')
  const [grams, setGrams] = useState(100)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!foodId && !name.trim()) {
      setError('Please provide a food name or select from the list')
      return
    }
    if (!grams || grams <= 0) {
      setError('Please enter a valid grams value')
      return
    }

    const payload = { grams }
    if (foodId) {
      payload.foodId = foodId
    } else {
      const trimmed = name.trim()
      // try to find a matching food from the loaded catalog
      const match = foods.find(f => f.name.toLowerCase() === trimmed.toLowerCase())
      if (match) {
        payload.foodId = match._id
      } else {
        // prompt user for per-100g macros (simple fallback UX)
        const c = window.prompt('Enter calories per 100g for "' + trimmed + '" (leave blank for 0)', '')
        if (c === null) return // user cancelled
        const p = window.prompt('Enter protein (g) per 100g', '')
        if (p === null) return
        const cb = window.prompt('Enter carbs (g) per 100g', '')
        if (cb === null) return
        const f = window.prompt('Enter fats (g) per 100g', '')
        if (f === null) return
        const calories = Number(c) || 0
        const protein = Number(p) || 0
        const carbs = Number(cb) || 0
        const fats = Number(f) || 0
        payload.name = trimmed || 'Custom'
        payload.per100 = { calories, protein, carbs, fats }
      }
    }

    try {
      await onAdd(payload)
      setName('')
      setFoodId('')
      setGrams(100)
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to add meal')
    }
  }

  return (
    <form className={styles.wrap} onSubmit={submit}>
      <div className={styles.row}>
        <select value={foodId} onChange={e=>{ setFoodId(e.target.value); setName('') }}>
          <option value="">-- choose food (or type custom) --</option>
          {foods.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <input placeholder="Custom food name" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div className={styles.row}>
        <input type="number" value={grams} onChange={e=>setGrams(Number(e.target.value))} />
        <button type="submit">Log Meal</button>
        <button type="button" onClick={()=>{ if (foods.length) { setFoodId(foods[0]._id); setName('') } }}>Image Placeholder</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  )
}
