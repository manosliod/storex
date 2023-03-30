// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'

// ** Types

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
import { editStore } from 'src/store/apps/currentStore'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { StoresType } from 'src/types/apps/storeTypes'

interface PostData {
  name?: string
  officialName?: string
  taxId?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
}

interface Props {
  storeData: StoresType
  error: any
}

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/
const schema = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  officialName: yup.string().required('Official Name is a required field'),
  taxId: yup.string().required('Tax ID Number is a required field').matches(/^\d+$/, 'Tax ID must be a number'),
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  country: yup.string().required('Country is a required field'),
  phone: yup.string().required('Phone is a required field').matches(phoneRegExp, 'Phone is not valid ex. +302101234567')
})

const StoreViewOverview = ({ storeData, error }: Props) => {
  const defaultValues = {
    name: '',
    officialName: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
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

  const dispatch = useDispatch<AppDispatch>()
  const [storeType, setStoreType] = useState<string>('')
  const [storeTypeError, setStoreTypeError] = useState<boolean>(false)
  const onEditUserSubmit = async (data: PostData) => {
    setStoreTypeError(storeType === '')
    if (storeType === '') return

    dispatch(editStore({ ...data, storeType }))
  }

  useEffect(() => {
    if (!!Object.keys(error).length && error.hasOwnProperty('type')) {
      setError(error.type, {
        type: 'manual',
        message: error.message
      })

      return
    }
    if (!Object.keys(storeData).length) return
    reset(storeData)
    setStoreType(storeData.storeType!)
  }, [reset, storeData, error])

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
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField {...field} fullWidth label='Name' error={Boolean(errors.name)} />}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='officialName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Official Name' error={Boolean(errors.officialName)} />
                    )}
                  />
                  {errors.officialName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.officialName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='taxId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label='Tax ID Number' error={Boolean(errors.taxId)} />
                    )}
                  />
                  {errors.taxId && <FormHelperText sx={{ color: 'error.main' }}>{errors.taxId.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='edit-store-type-select'>Select Store Type</InputLabel>
                  <Select
                    fullWidth
                    id='select-store-type-for-edit'
                    label='Select Store Type'
                    labelId='edit-store-type-select'
                    value={storeType}
                    onChange={e => setStoreType(e.target.value)}
                    inputProps={{ placeholder: 'Select Store Type' }}
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

export default StoreViewOverview
