// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

import { getCookie, setCookie, getCookies } from 'cookies-next'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user === null && !window.localStorage.getItem('userData')) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    }
    // else {
    //   if (router.asPath === '/') {
    //     router.replace('/home')
    //     console.log(getCookie('jwt', { path: '/' }), 'authGuard')
    //     setCookie('jwt', getCookie('jwt', { path: '/' }), { path: '/' })
    //   } else {
    //     console.log(getCookies(), 'authGuard')
    //   }
    // }
  }, [router.route, router.isReady])

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
