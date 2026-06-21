import React, { useState } from 'react'
import Api from '../api/api'
import styles from './Login.module.css'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        const res = await Api.register({ name, email, password })
        onLogin(res.token)
      } else {
        const res = await Api.login({ email, password })
        onLogin(res.token)
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.msg || 'Error')
    }
  }

  return (
    <div className={styles.authWrap}>
      <form className={styles.form} onSubmit={submit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {isRegister && <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <button type="button" className={styles.toggle} onClick={()=>{ setIsRegister(!isRegister); setError(null) }}>{isRegister ? 'Have an account? Login' : 'New user? Register'}</button>
      </form>
    </div>
  )
}
