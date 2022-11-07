// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import LockOutline from 'mdi-material-ui/LockOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Demo Components Imports
import UserViewOverview from 'src/views/apps/user/view/UserViewOverview'
import UserViewSecurity from 'src/views/apps/user/view/UserViewSecurity'
import {useRouter} from "next/router";

interface Props {
  userData: any
  error: any
  storeId: any
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ userData, error, storeId = null }: Props) => {
  // ** State
  const [value, setValue] = useState<string>('overview')

  const router = useRouter()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='overview' label='Overview' icon={<AccountOutline sx={{ fontSize: '18px' }} />} />
        {router.pathname.includes('/profile') &&
          <Tab value='security' label='Security' icon={<LockOutline sx={{fontSize: '18px'}}/>}/>
        }
      </TabList>
      <Box sx={{ mt: 3 }}>
        <TabPanel sx={{ p: 0 }} value='overview'>
          <UserViewOverview userData={userData} error={error} storeId={storeId} />
        </TabPanel>
        {router.pathname.includes('/profile') &&
          <TabPanel sx={{p: 0}} value='security'>
            <UserViewSecurity/>
          </TabPanel>
        }
      </Box>
    </TabContext>
  )
}

export default UserViewRight
