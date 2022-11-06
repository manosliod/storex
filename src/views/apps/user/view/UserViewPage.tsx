// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import { fetchUserData, fetchUserRole } from 'src/store/apps/currentUser'

// ** Types
import { UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useAuth } from 'src/hooks/useAuth'

const UserView = ({ id }: UserLayoutType) => {
  // ** State

  const auth = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentUser)

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserRole(auth.user))
      dispatch(fetchUserData(id))
    }
    fetchData()
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
          <UserViewRight userData={store.data} error={store.error} />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserView
