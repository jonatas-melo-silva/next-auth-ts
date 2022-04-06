import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { auth } from '../services/auth'

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = { email: string; password: string }

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  user?: User
  isAuthenticated: boolean
}

const AuthContext = createContext({} as AuthContextData)

type AuthProviderProps = {
  children: ReactNode
}

type AuthResponse = {
  permissions: string[]
  roles: string[]
  token: string
  refreshToken: string
}

export function signOut() {
  destroyCookie(null, 'token')
  destroyCookie(null, 'refreshToken')
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    const { '@nextauth:token': token } = parseCookies()

    if (token) {
      auth
        .get('/me')
        .then(response => {
          const { email, permissions, roles } = response.data
          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await auth.post<AuthResponse>('/sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(undefined, '@nextauth:token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, '@nextauth:refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setUser({
        email,
        permissions,
        roles
      })

      auth.defaults.headers.common['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (errorSignIn) {
      console.error(errorSignIn)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
