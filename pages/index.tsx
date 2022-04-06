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
    <>
      <title>Login</title>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Login</h1>
          <span>Digite seu email e senha</span>

          <form onSubmit={handleSubmit}>
            <div className={styles.campo}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.buttonEntrar} type="submit">
              Entrar
            </button>
          </form>
        </main>
      </div>
    </>
  )
}

export default Home
