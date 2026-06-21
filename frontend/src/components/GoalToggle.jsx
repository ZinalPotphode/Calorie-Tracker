import React from 'react'
import styles from './GoalToggle.module.css'

export default function GoalToggle({ goal, onChange }) {
  const options = [
    { key: 'weight_loss', label: 'Weight Loss' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'muscle_gain', label: 'Muscle Gain' }
  ]
  return (
    <div className={styles.wrap}>
      {options.map(o => (
        <button key={o.key} className={`${styles.btn} ${goal === o.key ? styles.active : ''}`} onClick={()=>onChange(o.key)}>{o.label}</button>
      ))}
    </div>
  )
}
