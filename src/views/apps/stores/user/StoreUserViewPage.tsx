// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import { fetchStoreUserData } from 'src/store/apps/currentStoreUser'

// ** Types
import { UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import StoreUserViewRight from 'src/views/apps/stores/user/StoreUserViewRight'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
type Props = UserLayoutType & {
  storeId: any
}
const StoreUserView = ({ id, storeId }: Props ) => {
  // ** State

  const auth = useAuth()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentStoreUser)

  useEffect(() => {
    const data = {
      id: id,
      params: {},
      storeId: storeId
    }
    dispatch(fetchStoreUserData(data))
  }, [dispatch])

  if (!!Object.keys(store.error).length && store.error.statusCode === 404) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            User named: {id} does not exist. Please check the list of users: <Link href='/users'>User List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (!!Object.keys(store.data).length) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={store.data} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <StoreUserViewRight userData={store.data} error={store.error} storeId={storeId} />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default StoreUserView
