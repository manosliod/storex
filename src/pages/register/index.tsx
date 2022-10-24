// ** React Imports
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import Box from '@mui/material/Box'
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { UserDataType } from 'src/context/types'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import moment from 'moment'
import * as yup from 'yup'
import 'yup-phone'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface State {
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  birthday: Date
  phone: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/
const schema = yup.object().shape({
  email: yup.string().email('Email must be a valid email e.g. user@domain.net').required('Email is a required field'),
  password: yup.string().min(5).required('Password is a required field'),
  passwordConfirm: yup
    .string()
    .min(5)
    .required('Password Confirm is a required field')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  fullName: yup.string().required('Full Name is a required field'),
  birthday: yup.date().nullable().required('Birthday is a required field'),
  phone: yup
    .string()
    .required('Mobile Phone is a required field')
    .matches(phoneRegExp, 'Mobile Phone is not valid ex. +302101234567')
})

interface FormData {
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  birthday: string
  phone: string
}

const RegisterPage = (props: { users: UserDataType[] }) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const minDate = moment().subtract(120, 'years').format('MM/DD/YYYY')
  const maxDate = moment().subtract(18, 'years').format('MM/DD/YYYY')

  // ** Hook
  const auth = useAuth()
  const theme = useTheme()

  const onSubmit = (data: FormData) => {
    data.birthday = moment(new Date(data.birthday)).format('MM-DD-YYYY')
    auth.register(data, err => {
      let name
      let message
      const { response } = err
      if (response.data.message) {
        name = response.data.message.split('/type:')[1]
        message = response.data.message.split('/type:')[0]
      } else {
        name = 'email'
        message = 'Email already in use!'
      }

      setError(name, {
        type: 'manual',
        message
      })
    })
  }

  const handleUsers = () => {
    auth.setUsers(props.users)
  }

  useEffect(() => {
    handleUsers()
  }, [])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your app management easy and fun!</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} autoFocus label='Email' error={Boolean(errors.email)} />}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <Controller
                name='password'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id='auth-register-password'
                    type='password'
                    label='Password'
                    error={Boolean(errors.password)}
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel htmlFor='auth-register-confirm-password'>Password Confirm</InputLabel>
              <Controller
                defaultValue=''
                name='passwordConfirm'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id='auth-register-confirm-password'
                    type='password'
                    label='Password Confirm'
                    error={Boolean(errors.passwordConfirm)}
                  />
                )}
              />
              {errors.passwordConfirm && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.passwordConfirm.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                defaultValue=''
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Full Name' error={Boolean(errors.fullName)} />}
              />
              {errors.fullName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                defaultValue={new Date(maxDate)}
                name='birthday'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      {...field}
                      label='Birthday'
                      minDate={new Date(minDate)}
                      maxDate={new Date(maxDate)}
                      renderInput={params => <TextField error={Boolean(errors.birthday)} {...params} />}
                    />
                  </LocalizationProvider>
                )}
              />
              {errors.birthday && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.birthday.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                defaultValue=''
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Mobile Phone' error={Boolean(errors.phone)} />}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Sign up
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
              <Typography>
                <Link passHref href='/login'>
                  <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                    Sign in instead
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-register-mask-${theme.palette.mode}.png`} />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterPage.guestGuard = true

export default RegisterPage

export async function getServerSideProps() {
  const users_res = await fetch('http://api.storex.local:81/api/v1/users')
  const promise = await users_res.json()
  const users = promise.data

  return {
    props: {
      users
    }
  }
}
