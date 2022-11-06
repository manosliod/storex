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
import StoreOutline from 'mdi-material-ui/StoreOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Demo Components Imports
import StoreViewStaff from 'src/pages/users'
import StoreViewOverview from 'src/views/apps/stores/view/StoreViewOverview'

interface Props {
  storeData: any
  error: any
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

const StoreViewRight = ({ storeData, error }: Props) => {
  // ** State
  const [value, setValue] = useState<string>('overview')

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
        <Tab value='overview' label='Overview' icon={<StoreOutline sx={{ fontSize: '18px' }} />} />
        <Tab value='staff' label='Staff' icon={<AccountOutline sx={{ fontSize: '18px' }} />} />
      </TabList>
      <Box sx={{ mt: 3 }}>
        <TabPanel sx={{ p: 0 }} value='overview'>
          <StoreViewOverview storeData={storeData} error={error} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='staff'>
          <StoreViewStaff storeData={storeData} />
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default StoreViewRight
