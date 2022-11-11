// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props

  // ** Hooks
  const router = useRouter()

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', ml: 4 }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder='Search Product'
          onChange={e => handleFilter(e.target.value)}
        />

        {!router.pathname.includes('/products') && (
          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
            Add Product
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
