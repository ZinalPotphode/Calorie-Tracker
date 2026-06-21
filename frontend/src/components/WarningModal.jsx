import React from 'react'
import styles from './WarningModal.module.css'

export default function WarningModal({ open, onClose, message }) {
  if (!open) return null
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <h3>Warning</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
