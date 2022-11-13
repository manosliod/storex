// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

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
import ShapeOutline from 'mdi-material-ui/ShapeOutline'
import PackageVariantClosed from 'mdi-material-ui/PackageVariantClosed'

// ** Demo Components Imports
import StoreViewStaff from 'src/pages/users'
import StoreViewOverview from 'src/views/apps/stores/view/StoreViewOverview'
import Categories from 'src/pages/categories'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import SubStores from '../../subStores/SubStores'

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
  // ** Hooks
  const auth = useAuth()
  const { role }: any = auth.user

  // ** State
  let activeTab = 'overview'
  if (role !== 'super-admin' && role !== 'store-admin' && role !== 'store-sub-admin') activeTab = 'categories'
  const [value, setValue] = useState<string>(activeTab)

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
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') && (
          <Tab value='overview' label='Overview' icon={<StoreOutline sx={{ fontSize: '18px' }} />} />
        )}
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') &&
          storeData.storeType === 'branch' && (
            <Tab value='subStores' label='Sub-Stores' icon={<StoreOutline sx={{ fontSize: '18px' }} />} />
          )}
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') && (
          <Tab value='staff' label='Staff' icon={<AccountOutline sx={{ fontSize: '18px' }} />} />
        )}
      </TabList>
      <Box sx={{ mt: 3 }}>
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') && (
          <TabPanel sx={{ p: 0 }} value='overview'>
            <StoreViewOverview storeData={storeData} error={error} />
          </TabPanel>
        )}
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') &&
          storeData.storeType === 'branch' && (
            <TabPanel sx={{ p: 0 }} value='subStores'>
              <SubStores id={storeData._id} />
            </TabPanel>
          )}
        {(role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') && (
          <TabPanel sx={{ p: 0 }} value='staff'>
            <StoreViewStaff storeData={storeData} />
          </TabPanel>
        )}
      </Box>
    </TabContext>
  )
}

export default StoreViewRight
