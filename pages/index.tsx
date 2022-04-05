import styles from '../styles/Home.module.css'
import type { NextPage } from 'next'
import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = { email, password }
    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.main}>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home
