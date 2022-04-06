import styles from '../styles/Home.module.css'
import { signOut, useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  function handleSignOut() {
    signOut()
  }

  return (
    <>
      <title>Dashboard</title>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Dashboard</h1>
          <span>{user?.email}</span>
          <div>
            <button className={styles.buttonSair} onClick={handleSignOut}>
              Sair
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
