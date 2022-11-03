// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import { editUser, fetchUserData } from 'src/store/apps/currentUser'

// ** Types
import { UsersType, UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

type Props = UserLayoutType & {
  userData: UsersType
  userError: boolean
}

const UserView = ({ id, userData, userError }: Props) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | any>(null)
  const [serverData, setServerData] = useState<null | any>(null)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentUser)

  interface PostData {
    _id?: string | number
    email: string
    fullName: string
    gender: string
    birthday: string
    phone: string
    role: string
  }
  const [gender, setGender] = useState<string>(userData.gender!)
  const [genderError, setGenderError] = useState<boolean>(false)
  const onEditUserSubmit = useCallback(
    async (data: PostData) => {
      setGenderError(gender === '')
      if (gender === '') return

      await dispatch(editUser({ ...data, gender }))

      const error = []
      const user = store.data
      // @ts-ignore
      if (user.email === data.email && data._id !== user._id) {
        error.push({
          type: 'email'
        })
      }

      // @ts-ignore
      if (user.phone === data.phone && data._id !== user._id) {
        error.push({
          type: 'phone'
        })
      }

      if (error.length > 0) {
        for (const errorElement of error) {
          // @ts-ignore
          setError(errorElement.type, {
            type: 'manual',
            message: 'Value already in use!'
          })
        }

        return
      }
      console.log(store, 'store 1')
      // dispatch(fetchUserData(id))
      // console.log(store, 'store 2')
      // setData(getState)
    },
    [dispatch]
  )

  useEffect(() => {
    setError(false)
    console.log(store, 'store 2')
    //@ts-ignore
    if (store.allData.status === 'fail') {
      setServerData(null)
      setError(true)

      return
    }
  }, [serverData, error])

  useEffect(() => {
    setServerData(userData)
    if (userError) setError(true)
  }, [serverData, userData])

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            User with the id: {id} does not exist. Please check the list of users: <Link href='/users'>User List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (serverData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={serverData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight
            userData={serverData}
            gender={gender}
            setGender={setGender}
            genderError={genderError}
            setGenderError={setGenderError}
            onEditUserSubmit={onEditUserSubmit}
          />
        </Grid>
      </Grid>
    )
  } else if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={store.data} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight
            userData={store.data}
            gender={gender}
            setGender={setGender}
            genderError={genderError}
            setGenderError={setGenderError}
            onEditUserSubmit={onEditUserSubmit}
          />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserView
