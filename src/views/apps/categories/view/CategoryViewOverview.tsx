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
import { editCategory } from 'src/store/apps/currentCategory'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

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
  categoryData: any
  techUsers: any
  error: any
  role: string
}

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/
const schema = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  user: yup.string().required('User is a required field')
})

const StoreViewOverview = ({ categoryData, techUsers, error, role }: Props) => {
  const defaultValues = {
    name: '',
    user: ''
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
  const onEditUserSubmit = async (data: PostData) => {
    dispatch(editCategory({ ...data }))
  }

  useEffect(() => {
    if (!!Object.keys(error).length && error.hasOwnProperty('type')) {
      setError(error.type, {
        type: 'manual',
        message: error.message
      })

      return
    }
    if (!Object.keys(categoryData).length) return
    reset({
      name: categoryData.name,
      user: categoryData.user._id
    })
  }, [reset, categoryData, error])

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
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel id='user-select'>Select User</InputLabel>
                  <Controller
                    name='user'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        id='select-user'
                        label='Select User'
                        labelId='user-select'
                        inputProps={{ placeholder: 'Select User' }}
                        error={Boolean(errors.user)}
                        {...field}
                      >
                        {techUsers !== undefined &&
                          techUsers.length > 0 &&
                          techUsers.map((techUser: any) => (
                            <MenuItem key={techUser.id.toString()} value={techUser.id}>
                              {techUser.username}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.user && <FormHelperText sx={{ color: 'error.main' }}>{errors.user.message}</FormHelperText>}
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
