// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import {getCookie, setCookie} from "cookies-next"

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

    const myRouter: any = router
    if(!!myRouter?.components['/']?.props.pageProps.cookie)
      setCookie('StorexAuth', myRouter.components['/'].props.pageProps.cookie)

    if (auth.user === null && !getCookie('StorexAuth')) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    }

  }, [router.route])

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
