// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import OutlinedInput from '@mui/material/OutlinedInput'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import moment from 'moment/moment'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  birthday: string
  phone: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
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

const defaultValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  fullName: '',
  birthday: new Date(moment().subtract(18, 'years').format('MM/DD/YYYY')),
  phone: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [gender, setGender] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [genderError, setGenderError] = useState<boolean>(false)
  const [roleError, setRoleError] = useState<boolean>(false)
  const store = useSelector((state: RootState) => state.user)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
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

  const minDate = moment().subtract(120, 'years').format('MM/DD/YYYY')
  const maxDate = moment().subtract(18, 'years').format('MM/DD/YYYY')

  const onSubmit = useCallback(
    async (data: UserData) => {
      setGenderError(gender === '')
      setRoleError(role === '')

      if (gender === '' || role === '') return

      dispatch(addUser({ ...data, role, gender }))

      const error = []
      for (const user of store.data) {
        // @ts-ignore
        if (user.email === data.email) {
          error.push({
            type: 'email'
          })
        }

        // @ts-ignore
        if (user.phone === data.phone) {
          error.push({
            type: 'phone'
          })
        }
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
      toggle()
      reset()
    },
    [gender, role, roleError, genderError]
  )

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleRoleChange = useCallback(
    (e: any) => {
      setRole(e.target.value)
      setRoleError(false)
    },
    [role, roleError]
  )

  const handleGenderChange = useCallback(
    (e: any) => {
      setGender(e.target.value)
      setGenderError(false)
    },
    [role, roleError]
  )

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add User</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
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
            {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
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
            {errors.fullName && <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>}
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
            {errors.birthday && <FormHelperText sx={{ color: 'error.main' }}>{errors.birthday.message}</FormHelperText>}
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
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              id='select-role'
              label='Select Role'
              labelId='role-select'
              value={role}
              onChange={e => handleRoleChange(e)}
              inputProps={{ placeholder: 'Select Role' }}
              error={roleError}
            >
              <MenuItem value='' disabled={true}>
                Select Role
              </MenuItem>
              <MenuItem value='super-admin'>Super Admin</MenuItem>
              <MenuItem value='store-admin'>Stores Admin</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='lead-tech'>Lead Tech</MenuItem>
              <MenuItem value='accountant'>Accountant</MenuItem>
              <MenuItem value='salesman'>Salesman</MenuItem>
              <MenuItem value='tech'>Tech</MenuItem>
            </Select>
            {roleError && <FormHelperText sx={{ color: 'error.main' }}>Role is a required field!</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
