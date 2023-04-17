// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Imports
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addStore } from 'src/store/apps/stores'

// ** Types Imports
import { AppDispatch } from 'src/store'
import { PayloadAction } from '@reduxjs/toolkit'
import { CardContent } from '@mui/material'
import BlankLayout from '../../@core/layouts/BlankLayout'
import FooterIllustrationsV1 from '../../views/pages/auth/FooterIllustrationsV1'
import themeConfig from '../../configs/themeConfig'
import AppLogo from '../../@core/components/app-logo/AppLogo'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'

interface StoreData {
  name?: string
  officialName?: string
  taxId?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
}

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/

const schema = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  officialName: yup.string().required('Official Name is a required field'),
  taxId: yup.string().required('Tax ID Number is a required field').matches(/^\d+$/, 'Tax ID must be a number'),
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  country: yup.string().required('Country is a required field'),
  phone: yup
    .string()
    .required('Phone is a required field')
    .matches(phoneRegExp, 'Mobile Phone is not valid ex. +302101234567')
})

const defaultValues = {
  name: '',
  officialName: '',
  taxId: '',
  address: '',
  city: '',
  country: '',
  phone: ''
}

const RegisterStorePage = () => {
  // ** State
  const [storeType, setStoreType] = useState<string>('')
  const [storeTypeError, setStoreTypeError] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: StoreData) => {
    setStoreTypeError(storeType === '')

    if (storeType === '') return

    const action: PayloadAction<{} | any> = await dispatch(addStore({ ...data, storeType }))
    if (!!Object.keys(action.payload).length && action.payload.hasOwnProperty('error')) {
      const { type, message }: any = action.payload.error
      if (type === 'fail' || type === 'error') {
        toast.error(message, { duration: 5000 })
      } else {
        setError(type, {
          type: 'manual',
          message
        })
      }

      return
    }
  }

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
              Add Store 🚀
            </Typography>
            <Typography variant='body2'>Add your store so you may start editing!</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField autoFocus {...field} label='Name' error={Boolean(errors.name)} />}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='officialName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label='Official Name' error={Boolean(errors.officialName)} />
                )}
              />
              {errors.officialName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.officialName.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='taxId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label='Tax ID Number' error={Boolean(errors.taxId)} />}
              />
              {errors.taxId && <FormHelperText sx={{ color: 'error.main' }}>{errors.taxId.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id='store-type-select'>Select Store Type</InputLabel>
              <Select
                fullWidth
                id='select-store-type'
                label='Select Store Type'
                labelId='store-type-select'
                value={storeType}
                onChange={e => setStoreType(e.target.value)}
                inputProps={{ placeholder: 'Select Store Type' }}
                error={storeTypeError}
              >
                <MenuItem value='' disabled={true}>
                  Select Store Type
                </MenuItem>
                <MenuItem value='individual'>Individual</MenuItem>
                <MenuItem value='branch'>Branch</MenuItem>
              </Select>
              {storeTypeError && (
                <FormHelperText sx={{ color: 'error.main' }}>Store Type is a required field!</FormHelperText>
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
                render={({ field }) => <TextField {...field} label='Phone' error={Boolean(errors.phone)} />}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-register-mask-${theme.palette.mode}.png`} />
    </Box>
  )
}

RegisterStorePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterStorePage.guestGuard = true

export default RegisterStorePage
