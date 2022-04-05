import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../context/AuthContext'

let cookies = parseCookies()
let isRefreshing = false
let failedRequestQueue: any[] = []

export const auth = axios.create({
  baseURL: 'http://localhost:3333'
})

auth.defaults.headers.common[
  'Authorization'
] = `Bearer ${cookies['@nextauth:token']}`

auth.interceptors.response.use(
  response => response,
  (errorInterceptors: AxiosError) => {
    if (errorInterceptors.response?.status === 401) {
      if (errorInterceptors.response.data?.code === 'token.expired') {
        cookies = parseCookies()

        const { '@nextauth:refreshToken': refreshToken } = cookies

        const originalConfig = errorInterceptors.config

        if (!isRefreshing) {
          isRefreshing = true

          auth
            .post('/refresh', { refreshToken })
            .then(response => {
              const { token } = response.data

              setCookie(undefined, '@nextauth:token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
              })

              setCookie(
                undefined,
                '@nextauth:refreshToken',
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/'
                }
              )

              auth.defaults.headers.common['Authorization'] = `Bearer ${token}`

              failedRequestQueue.forEach(request => request.onSuccess(token))
              failedRequestQueue = []
            })
            .catch(errorRefreshToken => {
              failedRequestQueue.forEach(request =>
                request.onSuccess(errorRefreshToken)
              )
              failedRequestQueue = []
            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              if (!originalConfig?.headers) {
                return // If there is no originalConfig, then the request was already cancelled
              }
              originalConfig.headers['Authorization'] = `Bearer ${token}`
              resolve(auth(originalConfig))
            },
            onFailure: (errorRefreshToken: AxiosError) => {
              reject(errorRefreshToken)
            }
          })
        })
      } else {
        signOut()
      }
    }

    return Promise.reject(errorInterceptors)
  }
)
