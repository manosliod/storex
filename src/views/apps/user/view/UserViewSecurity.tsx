// ** React Imports
import { ChangeEvent, Fragment, MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { editUser, updatePassword } from 'src/store/apps/currentUser'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

interface State {
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmNewPassword: boolean
}

const schema = yup.object().shape({
  passwordCurrent: yup.string().required('Current Password is a required field'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is a required field'),
  passwordConfirm: yup
    .string()
    .min(8, 'Password Confirm must be at least 8 characters')
    .required('Password Confirm is a required field')
    .oneOf([yup.ref('password')], 'Passwords do not match')
})

interface PostData {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}

const UserViewSecurity = () => {
  const defaultValues = {
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
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

  // ** States
  const [values, setValues] = useState<State>({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false
  })

  // Handle Current Password
  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleMouseDownCurrentPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Password
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const dispatch = useDispatch<AppDispatch>()
  const onSubmit = async (data: PostData) => {
    const action: PayloadAction<{} | any> = await dispatch(updatePassword({ ...data }))
    if (!!Object.keys(action.payload).length && action.payload.hasOwnProperty('error')) {
      const { statusCode, type, message }: any = action.payload.error
      if (statusCode === 401) {
        setError('passwordCurrent', {
          type: 'manual',
          message
        })
      } else if (type !== 'fail' || type !== 'error') {
        setError(type, {
          type: 'manual',
          message
        })
      } else {
        toast.error(message, { duration: 5000 })
      }

      return
    }
    reset()
  }

  return (
    <Fragment>
      <Card sx={{ mb: 6 }}>
        <CardHeader title='Change Password' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
            <AlertTitle sx={{ mb: theme => `${theme.spacing(1)} !important` }}>
              Ensure that these requirements are met
            </AlertTitle>
            Minimum 8 characters long, uppercase & symbol
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel htmlFor='user-view-security-new-password'>Current Password</InputLabel>
                  <Controller
                    name='passwordCurrent'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        label='Current Password'
                        id='user-view-security-new-password'
                        type={values.showCurrentPassword ? 'text' : 'password'}
                        error={Boolean(errors.passwordCurrent)}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowCurrentPassword}
                              aria-label='toggle password visibility'
                              onMouseDown={handleMouseDownCurrentPassword}
                            >
                              {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.passwordCurrent && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.passwordCurrent.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel htmlFor='user-view-security-new-password'>New Password</InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        label='New Password'
                        id='user-view-security-new-password'
                        type={values.showNewPassword ? 'text' : 'password'}
                        error={Boolean(errors.password)}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowNewPassword}
                              aria-label='toggle password visibility'
                              onMouseDown={handleMouseDownNewPassword}
                            >
                              {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel htmlFor='user-view-security-new-password-confirm'>New Password Confirm</InputLabel>
                  <Controller
                    name='passwordConfirm'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        label='New Password Confirm'
                        id='user-view-security-new-password-confirm'
                        type={values.showConfirmNewPassword ? 'text' : 'password'}
                        error={Boolean(errors.passwordConfirm)}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmNewPassword}
                              onMouseDown={handleMouseDownConfirmNewPassword}
                            >
                              {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.passwordConfirm && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.passwordConfirm.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type='submit' variant='contained'>
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Fragment>
  )
}

export default UserViewSecurity
