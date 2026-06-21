import React from 'react'
import styles from './VisualDashboard.module.css'

function ProgressBar({ value, target }) {
  const pct = target ? Math.min(100, Math.round((value/target)*100)) : 0
  const over = value > target
  const color = over ? '#dc3545' : '#28a745'
  return (
    <div className={styles.progressWrap}>
      <div className={styles.bar} style={{ background: '#eee' }}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color }}></div>
      </div>
      <div className={styles.meta}>{value} / {target} kcal</div>
    </div>
  )
}

export default function VisualDashboard({ totals, target, macroRatios }) {
  const proteinTarget = target ? Math.round((macroRatios?.protein || 30) / 100 * target / 4) : 0
  const carbsTarget = target ? Math.round((macroRatios?.carbs || 40) / 100 * target / 4) : 0
  const fatsTarget = target ? Math.round((macroRatios?.fats || 30) / 100 * target / 9) : 0

  return (
    <div className={styles.wrap}>
      <ProgressBar value={totals.calories} target={target} />
      <div className={styles.macros}>
        <div className={styles.macro}><strong>Protein</strong> {totals.protein}g / {proteinTarget}g</div>
        <div className={styles.macro}><strong>Carbs</strong> {totals.carbs}g / {carbsTarget}g</div>
        <div className={styles.macro}><strong>Fats</strong> {totals.fats}g / {fatsTarget}g</div>
      </div>
    </div>
  )
}
