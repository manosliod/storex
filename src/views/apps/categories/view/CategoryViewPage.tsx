// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import { fetchCategoryData, fetchURLForCategory } from 'src/store/apps/currentCategory'

// ** Types
import { CategoriesLayoutType } from 'src/types/apps/catgoryTypes'

// ** Demo Components Imports
import CategoryViewLeft from 'src/views/apps/categories/view/CategoryViewLeft'
import CategoryViewRight from 'src/views/apps/categories/view/CategoryViewRight'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useRouter } from 'next/router'

import { useAuth } from 'src/hooks/useAuth'

const CategoryView = ({ id }: CategoriesLayoutType) => {
  // ** State
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentCategory)

  const auth = useAuth()
  const { categories, role }: any = auth.user
  useEffect(() => {
    const fetchData = async () => {
      const { user }: any = auth
      const data: any = {
        id: id,
        storeId: user.store,
        role: user.role
      }
      await dispatch(fetchURLForCategory(data))
      dispatch(fetchCategoryData(id))
    }
    fetchData()
  }, [dispatch, id])

  if (!!Object.keys(store.error).length && store.error.statusCode === 404 && !router.pathname.includes('/home')) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Category with the id: {id} does not exist. Please check the list of stores:{' '}
            <Link href='/categories'>Category List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (!!Object.keys(store.data).length) {
    const { subcategories }: any = store.data
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <CategoryViewLeft data={store.data} />
        </Grid>
        {(role === 'super-admin' ||
          role === 'store-admin' ||
          role === 'store-sub-admin' ||
          role === 'lead-tech' ||
          role === 'tech') && (
          <Grid item xs={12} md={7} lg={8}>
            <CategoryViewRight
              categoryData={store.data}
              techUsers={store.techUsers}
              error={store.error}
              subcategories={subcategories}
            />
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

export default CategoryView
