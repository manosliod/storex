// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
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

interface PostData {
  _id?: string | number
  email: string
  fullName: string
  gender: string
  birthday: string
  phone: string
  role: string
}

interface Props {
  userData: UsersType
  error: any
}

interface ProjectListDataType {
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}

const projectListDate: ProjectListDataType[] = [
  {
    hours: '18:42',
    progressValue: 78,
    totalTask: '122/240',
    progressColor: 'success',
    projectType: 'React Project',
    projectTitle: 'BGC eCommerce App',
    img: '/images/icons/project-icons/react.png'
  },
  {
    hours: '20:42',
    progressValue: 18,
    totalTask: '9/56',
    progressColor: 'error',
    projectType: 'Figma Project',
    projectTitle: 'Falcon Logo Design',
    img: '/images/icons/project-icons/figma.png'
  },
  {
    hours: '120:87',
    progressValue: 62,
    totalTask: '290/320',
    progressColor: 'primary',
    projectType: 'VueJs Project',
    projectTitle: 'Dashboard Design',
    img: '/images/icons/project-icons/vue.png'
  },
  {
    hours: '89:19',
    progressValue: 8,
    totalTask: '7/63',
    progressColor: 'error',
    projectType: 'Xamarin Project',
    projectTitle: 'Foodista Mobile App',
    img: '/images/icons/project-icons/xamarin.png'
  },
  {
    hours: '230:10',
    progressValue: 49,
    totalTask: '120/186',
    progressColor: 'warning',
    projectType: 'Python Project',
    projectTitle: 'Dojo React Project',
    img: '/images/icons/project-icons/python.png'
  },
  {
    hours: '342:41',
    progressValue: 92,
    totalTask: '99/109',
    progressColor: 'success',
    projectType: 'Sketch Project',
    projectTitle: 'Blockchain Website',
    img: '/images/icons/project-icons/sketch.png'
  },
  {
    hours: '12:45',
    progressValue: 88,
    totalTask: '98/110',
    progressColor: 'success',
    projectType: 'HTML Project',
    projectTitle: 'Hoffman Website',
    img: '/images/icons/project-icons/html5.png'
  }
]

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

// Styled component for images
const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

const phoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/
const schema = yup.object().shape({
  email: yup.string().email('Email must be a valid email e.g. user@domain.net').required('Email is a required field'),
  fullName: yup.string().required('Full Name is a required field'),
  birthday: yup.date().nullable().required('Birthday is a required field'),
  phone: yup
    .string()
    .required('Mobile Phone is a required field')
    .matches(phoneRegExp, 'Mobile Phone is not valid ex. +302101234567')
})

const UserViewOverview = ({ userData, error }: Props) => {
  const defaultValues = {
    email: '',
    fullName: '',
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

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.currentUser)
  const [gender, setGender] = useState<string>('')
  const [genderError, setGenderError] = useState<boolean>(false)
  const onEditUserSubmit = async (data: PostData) => {
    setGenderError(gender === '')
    if (gender === '') return

    await dispatch(editUser({ ...data, gender }))

    const error = []
    const user = store.data
    // @ts-ignore
    if (user.email === data.email && data._id !== user._id) {
      error.push({
        type: 'email'
      })
    }

    // @ts-ignore
    if (user.phone === data.phone && data._id !== user._id) {
      error.push({
        type: 'phone'
      })
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
                    name='phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) =>
                      <TextField {...field} fullWidth label='Mobile Phone' error={Boolean(errors.phone)} />
                    }
                  />
                  {errors.phone && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>
                  )}
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
