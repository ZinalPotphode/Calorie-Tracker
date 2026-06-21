import React from 'react'
import styles from './DailyHistory.module.css'

export default function DailyHistory({ meals, onDelete }) {
  return (
    <div className={styles.wrap}>
      <h3>Daily History</h3>
      <ul>
        {meals.map(m => (
          <li key={m._id} className={styles.item}>
            <div>
              <div className={styles.name}>{m.name}</div>
              <div className={styles.sub}>{m.grams}g — {m.calories} kcal</div>
            </div>
            <button onClick={()=>onDelete(m._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
