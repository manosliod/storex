// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import { editStore } from 'src/store/apps/stores'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { SelectChangeEvent } from '@mui/material/Select/SelectInput'

interface SidebarEditUserType {
  open: boolean
  toggle: () => void
  data: StoreData
}

interface StoreData {
  name?: string
  officialName?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
  phone?: string
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
    officialName: data.officialName,
    address: data.address,
    city: data.city,
    country: data.country,
    phone: data.phone
  }

  const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/

  const schema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    officialName: yup.string().required('Official Name is a required field'),
    address: yup.string().required('Address is a required field'),
    city: yup.string().required('City is a required field'),
    country: yup.string().required('Country is a required field'),
    phone: yup
      .string()
      .required('Phone is a required field')
      .matches(phoneRegExp, 'Phone is not valid ex. +302101234567')
  })

  // ** State
  const [storeType, setStoreType] = useState<string>('')
  const [storeTypeError, setStoreTypeError] = useState<boolean>(false)
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

  const onSubmit = (data: StoreData) => {
    setStoreTypeError(storeType === '')
    if (storeType === '') return

    dispatch(editStore({ ...data, storeType }))

    const error = []
    for (const storeData of store.data) {
      // @ts-ignore
      if (storeData.phone === data.phone && data._id !== storeData._id) {
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
  }

  const handleStoreTypeChange = useCallback(
    (e: SelectChangeEvent) => {
      setStoreType(e.target.value)
      setStoreTypeError(false)
    },
    [storeType, storeTypeError]
  )

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
        <Typography variant='h6'>Edit Store</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} autoFocus label='Name' error={Boolean(errors.name)} />}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='officialName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} autoFocus label='Official Name' error={Boolean(errors.officialName)} />
              )}
            />
            {errors.officialName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.officialName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='store-type-select'>Select Store Type</InputLabel>
            <Select
              fullWidth
              id='select-store-type'
              label='Select Store Type'
              labelId='store-type-select'
              value={storeType}
              onChange={e => handleStoreTypeChange(e)}
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
              render={({ field }) => <TextField {...field} autoFocus label='Address' error={Boolean(errors.address)} />}
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
