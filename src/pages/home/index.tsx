// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Third Party Components
import Spinner from 'src/@core/components/spinner'
import StoreViewPage from 'src/views/apps/stores/view/StoreViewPage'
import { useEffect } from 'react'
import { fetchStoreData } from '../../store/apps/currentStore'

const Home = () => {
  const auth = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentStore)
  const { role }: any = auth.user

  useEffect(() => {
    if (role !== 'super-admin') {
      const { store }: any = auth.user
      if (store !== undefined) dispatch(fetchStoreData(store))
    }
  }, [dispatch, auth.user])

  if (!Object.keys(store.data).length && role !== 'super-admin') {
    return <Spinner />
  }

  if (!!Object.keys(store.data).length && role !== 'super-admin') {
    const { id }: any = store.data
    
return <StoreViewPage id={id} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Welcome 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              As a Super Admin you can manage everything except Store Categories and Products.
            </Typography>
            <Typography>Please deal it with care.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Home.acl = {
  action: 'manage',
  subject: 'home'
}

export default Home
