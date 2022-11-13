// ** React Imports
import { useEffect } from 'react'

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
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { editProduct } from 'src/store/apps/products'

// ** Types Imports
import { AppDispatch } from 'src/store'
import toast from 'react-hot-toast'
import { PayloadAction } from '@reduxjs/toolkit'
import { useAuth } from '../../../../hooks/useAuth'

interface SidebarEditUserType {
  open: boolean
  toggle: () => void
  data: ProductData
}

interface ProductData {
  name: string
  serialNumber: number
  price: number
  quantity: number
  productType: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const SidebarEditUser = (props: SidebarEditUserType) => {
  // ** Props
  const { open, toggle, data } = props

  const defaultValues = {
    name: data.name,
    serialNumber: data.serialNumber,
    price: data.price,
    quantity: data.quantity,
    productType: data.productType
  }

  const schema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    serialNumber: yup
      .number()
      .positive('Serial Number must be a positive Number')
      .typeError('Serial Number must be a number ex. 123')
      .required('Serial Number is a required field')
      .moreThan(0, 'Must be more than 0'),
    price: yup
      .number()
      .positive('Price must be a positive Number')
      .typeError('Price must be a number ex. 123, 45.6')
      .required('Price is a required field')
      .moreThan(0, 'Must be more than 0'),
    quantity: yup
      .number()
      .positive('Quantity must be a positive Number')
      .typeError('Quantity must be a number ex. 123')
      .required('Quantity is a required field')
      .moreThan(0, 'Must be more than 0'),
    productType: yup.string().required('Product Type is a required field')
  })

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
  const auth = useAuth()
  const { user }: any = auth
  const onSubmit = async (data: ProductData) => {
    const action: PayloadAction<{} | any> = await dispatch(editProduct({ ...data, store: user.store }))
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

    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  useEffect(() => {
    reset(data)
  }, [reset, data])

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
        <Typography variant='h6'>Edit Product</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
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
              name='serialNumber'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label='Serial Number' error={Boolean(errors.serialNumber)} />
              )}
            />
            {errors.serialNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.serialNumber.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='product-type-select'>Select Product Type</InputLabel>
            <Controller
              name='productType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id='select-product-type'
                  label='Select Product Type'
                  labelId='product-type-select'
                  inputProps={{ placeholder: 'Select Product Type' }}
                  error={Boolean(errors.productType)}
                >
                  <MenuItem value='' disabled={true}>
                    Select Product Type
                  </MenuItem>
                  <MenuItem value='commercial'>Commercial</MenuItem>
                  <MenuItem value='demo'>Demo</MenuItem>
                </Select>
              )}
            />
            {errors.productType && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.productType.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='price'
              control={control}
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label='Price' error={Boolean(errors.price)} />}
            />
            {errors.price && <FormHelperText sx={{ color: 'error.main' }}>{errors.price.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='quantity'
              control={control}
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label='Quantity' error={Boolean(errors.quantity)} />}
            />
            {errors.quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.quantity.message}</FormHelperText>}
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

export default SidebarEditUser
