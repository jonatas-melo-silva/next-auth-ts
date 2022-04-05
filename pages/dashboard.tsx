import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth } from '../services/auth'

export default function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    auth
      .get('/me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  )
}
