// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import { fetchStoreData } from 'src/store/apps/currentStore'

// ** Types
import { StoreLayoutType } from 'src/types/apps/storeTypes'

// ** Demo Components Imports
import StoreViewLeft from 'src/views/apps/stores/view/StoreViewLeft'
import StoreViewRight from 'src/views/apps/stores/view/StoreViewRight'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const StoreView = ({ id }: StoreLayoutType) => {
  // ** State
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentStore)
  const auth = useAuth()
  const { role }: any = auth.user
  useEffect(() => {
    if (id !== undefined) dispatch(fetchStoreData(id))
  }, [dispatch])

  if (!!Object.keys(store.error).length && store.error.statusCode === 404 && !router.pathname.includes('/home')) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Store with the id: {id} does not exist. Please check the list of stores:{' '}
            <Link href='/stores'>Store List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (!!Object.keys(store.data).length) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <StoreViewLeft data={store.data} />
        </Grid>
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin' || role === 'lead-tech') && (
          <Grid item xs={12} md={7} lg={8}>
            <StoreViewRight storeData={store.data} error={store.error} />
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

export default StoreView
