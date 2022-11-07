// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'

// ** Types
import { UsersType } from 'src/types/apps/userTypes'

// ** Demo Component Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DialogContent from '@mui/material/DialogContent'
import FormHelperText from '@mui/material/FormHelperText'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import { editUser } from '../../../../store/apps/currentUser'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../../store'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { PayloadAction } from '@reduxjs/toolkit'

interface PostData {
  _id?: string | number
  email: string
  username: string
  fullName: string
  gender: string
  address: string
  city: string
  country: string
  birthday: string
  phone: string
  role: string
}

interface Props {
  userData: UsersType
  error: any
  storeId: any
}

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/
const schema = yup.object().shape({
  email: yup.string().email('Email must be a valid email e.g. user@domain.net').required('Email is a required field'),
  username: yup.string().required('Username is a required field'),
  fullName: yup.string().required('Full Name is a required field'),
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  country: yup.string().required('Country is a required field'),
  birthday: yup.date().nullable().required('Birthday is a required field'),
  phone: yup
    .string()
    .required('Mobile Phone is a required field')
    .matches(phoneRegExp, 'Mobile Phone is not valid ex. +302101234567')
})

const UserViewOverview = ({ userData, error, storeId = null }: Props) => {
  const defaultValues = {
    email: '',
    username: '',
    fullName: '',
    address: '',
    city: '',
    country: '',
    birthday: '',
    phone: ''
  }

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [gender, setGender] = useState<string>('')
  const [genderError, setGenderError] = useState<boolean>(false)
  const [storeError, setStoreError] = useState<boolean>(false)
  const onEditUserSubmit = async (data: PostData) => {
    setGenderError(gender === '')
    if (gender === '') return

    dispatch(editUser({ ...data, gender }))
  }

  useEffect(() => {
    if (!!Object.keys(error).length && error.hasOwnProperty('type')) {
      setError(error.type, {
        type: 'manual',
        message: error.message
      })

      return
    }
    if (!Object.keys(userData).length) return
    reset(userData)
    setGender(userData.gender!)
    if (router.pathname !== '/profile') {
      const url = storeId !== null ? `/stores/${storeId}/user/${userData.username}` : `/users/view/${userData.username}`
      router.replace(
        {
          pathname: url
        },
        url,
        { shallow: true }
      )
    }
  }, [reset, userData, error])

  return (
    <Fragment>
      <Card sx={{ mb: 6 }}>
        <CardHeader title='Details' titleTypographyProps={{ variant: 'h6' }} />

        <Divider sx={{ m: 0 }} />
        <DialogContent>
          <form onSubmit={handleSubmit(onEditUserSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Username' error={Boolean(errors.username)} />
                    )}
                  />
                  {errors.username && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth type='email' label='Email' error={Boolean(errors.email)} />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='fullName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Full Name' error={Boolean(errors.fullName)} />
                    )}
                  />
                  {errors.fullName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='edit-gender-select'>Select Gender</InputLabel>
                  <Select
                    fullWidth
                    id='select-gender-for-edit'
                    label='Select Gender'
                    labelId='edit-gender-select'
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    inputProps={{ placeholder: 'Select Gender' }}
                  >
                    <MenuItem value='' disabled={true}>
                      Select Gender
                    </MenuItem>
                    <MenuItem value='male'>Male</MenuItem>
                    <MenuItem value='female'>Female</MenuItem>
                    <MenuItem value='other'>Other</MenuItem>
                  </Select>
                  {genderError && (
                    <FormHelperText sx={{ color: 'error.main' }}>Gender is a required field!</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Address' error={Boolean(errors.address)} />
                    )}
                  />
                  {errors.address && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='city'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField {...field} fullWidth label='City' error={Boolean(errors.city)} />}
                  />
                  {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='country'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Country' error={Boolean(errors.country)} />
                    )}
                  />
                  {errors.country && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Mobile Phone' error={Boolean(errors.phone)} />
                    )}
                  />
                  {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size='large' type='submit' variant='contained'>
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Card>
    </Fragment>
  )
}

export default UserViewOverview
