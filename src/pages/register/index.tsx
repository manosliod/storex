// ** React Imports
import { ReactNode, useCallback, useState } from 'react'

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

// ** Icons Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { PayloadAction } from '@reduxjs/toolkit'
import { signupUser } from 'src/store/apps/user'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import AppLogo from '../../@core/components/app-logo/AppLogo'

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
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  country: yup.string().required('Country is a required field'),
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

const RegisterPage = () => {
  const [gender, setGender] = useState<string>('')
  const [genderError, setGenderError] = useState<boolean>(false)

  const handleGenderChange = useCallback(
    (e: any) => {
      setGender(e.target.value)
      setGenderError(false)
    },
    [gender, genderError]
  )

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
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setGenderError(gender === '')

      if (gender === '') return

      data.birthday = moment(new Date(data.birthday)).format('MM-DD-YYYY')

      const role = 'store-admin'
      const action: PayloadAction<{} | any> = await dispatch(signupUser({ ...data, role, gender }))
      console.log(action)
      if (!!Object.keys(action.payload).length && action.payload.hasOwnProperty('error')) {
        const { type, message }: any = action.payload.error
        if (type === 'fail' || type === 'error') {
          toast.error(message, { duration: 5000 })
          
return
        } else if (message) {
          setError(type, {
            type: 'manual',
            message
          })
          
return
        }
      }

      const { email, password } = data
      auth.login({ email, password })
    },
    [gender, genderError]
  )

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppLogo />
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
          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    autoComplete='off'
                    label='Username'
                    error={Boolean(errors.username)}
                  />
                )}
              />
              {errors.username && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Email' error={Boolean(errors.email)} />}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <Controller
                name='password'
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
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Full Name' error={Boolean(errors.fullName)} />}
              />
              {errors.fullName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='gender-select'>Select Gender</InputLabel>
              <Select
                fullWidth
                id='select-gender'
                label='Select Gender'
                labelId='gender-select'
                value={gender}
                onChange={e => handleGenderChange(e)}
                inputProps={{ placeholder: 'Select Gender' }}
                error={genderError}
              >
                <MenuItem value='' disabled={true}>
                  Select Gender
                </MenuItem>
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
              {genderError && <FormHelperText sx={{ color: 'error.main' }}>Gender is a required field!</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
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
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Address' error={Boolean(errors.address)} />}
              />
              {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='City' error={Boolean(errors.city)} />}
              />
              {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Country' error={Boolean(errors.country)} />}
              />
              {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
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
