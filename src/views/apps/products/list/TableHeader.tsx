// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { useAuth } from '../../../../hooks/useAuth'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  categoryData: any | undefined
  checked: any
  toggleChecked: any
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, categoryData, checked, toggleChecked } = props

  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const { role, categories, store }: any = auth.user

  return (
    <Grid container sx={{ justifyContent: 'between' }}>
      {router.pathname.includes('/products') && store.storeType === 'branch' && (
        <Grid item sx={{ p: 5, pb: 3, alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={checked} onChange={toggleChecked} />}
            label={checked ? 'Search in Branches' : 'Search in Store'}
          />
        </Grid>
      )}
      <Grid item sx={{ p: 5, pb: 3, ml: 'auto', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', ml: 4 }}>
          <TextField
            size='small'
            value={value}
            sx={{
              mr:
                role !== 'store-admin' &&
                role !== 'store-sub-admin' &&
                role !== 'lead-tech' &&
                !(
                  router.pathname.includes('/categories/view') &&
                  role === 'tech' &&
                  categories.find((category: any) => category.toString() === categoryData._id)
                )
                  ? 0
                  : 6,
              mb: 2
            }}
            placeholder='Search Product'
            onChange={e => handleFilter(e.target.value)}
          />

          {((router.pathname.includes('/categories/view') &&
            role === 'tech' &&
            categories.find((category: any) => category.toString() === categoryData._id)) ||
            role === 'store-admin' ||
            role === 'store-sub-admin' ||
            role === 'lead-tech') && (
            <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
              Add Product
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default TableHeader
