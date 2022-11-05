// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

interface Props {
  data: any
}

interface ColorsType {
  [key: string]: ThemeColor
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 400,
  fontSize: '.875rem',
  lineHeight: '1.25rem',
  alignSelf: 'flex-end'
})

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const UserViewLeft = ({ data }: Props) => {
  const renderUserAvatar = () => {
    if (!!Object.keys(data).length) {
      // if (data.avatar.length) {
      //   return (
      //     <CustomAvatar alt='User Image' src={data.avatar} variant='rounded' sx={{ width: 120, height: 120, mb: 4 }} />
      //   )
      // } else {
      return (
        <CustomAvatar
          skin='light'
          variant='rounded'
          // color={data.avatarColor as ThemeColor}
          sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
        >
          {getInitials(data.fullName)}
        </CustomAvatar>
      )
    }
    // } else {
    //   return null
    // }
  }

  if (!!Object.keys(data).length) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderUserAvatar()}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {data.fullName}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role]}
                sx={{
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ mt: 4 }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Email:
                  </Typography>
                  <Typography variant='body2'>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Role:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {data.role}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tax ID:</Typography>
                  <Typography variant='body2'>Tax-8894</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Mobile Phone:</Typography>
                  <Typography variant='body2'>{data.phone}</Typography>
                </Box>
                {/*<Box sx={{ display: 'flex' }}>*/}
                {/*  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Country:</Typography>*/}
                {/*  <Typography variant='body2'>{data.country}</Typography>*/}
                {/*</Box>*/}
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button color='error' variant='outlined'>
                Suspend
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
