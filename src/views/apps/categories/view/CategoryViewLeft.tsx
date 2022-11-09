// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

interface Props {
  data: any
}

interface ColorsType {
  [key: string]: ThemeColor
}

const storeTypeColors: ColorsType = {
  branch: 'primary',
  individual: 'info'
}

const CategoryViewLeft = ({ data }: Props) => {
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
          {getInitials(data.name)}
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
          <Card sx={{ pb: 10 }}>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderUserAvatar()}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {data.name}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={`@${data.user.username}`}
                // color={storeTypeColors[data.storeType]}
                sx={{
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default CategoryViewLeft
