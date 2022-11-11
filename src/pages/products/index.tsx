// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteProduct, fetchURLForProducts } from 'src/store/apps/products'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ProductsType } from 'src/types/apps/productTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/products/list/TableHeader'
import AddProductDrawer from 'src/views/apps/products/list/AddProductDrawer'
import EditProductDrawer from 'src/views/apps/products/list/EditProductDrawer'
import { NextRouter, useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'

interface ProductData {
  name?: string
  officialName?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
}

const ProductDataDefault: ProductData = {
  name: '',
  officialName: '',
  storeType: '',
  address: '',
  city: '',
  country: ''
}

interface CellType {
  row: ProductsType
}

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Grid)(({ theme }) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3)
}))

const handleRoute = (router: NextRouter, url?: string, params?: {}) => {
  if (url) {
    router.replace(
      {
        pathname: url,
        query: { ...params }
      },
      url,
      { shallow: true }
    )
  }
}

// ** renders client column
const RenderClient = (row: ProductsType) => {
  const router = useRouter()

  return (
    <AvatarWithoutImageLink onClick={() => handleRoute(router, `/stores/view/${row.id}`)}>
      <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    </AvatarWithoutImageLink>
  )
}

const Products = () => {
  // ** State
  const [currentProduct, setCurrentProduct] = useState<ProductData>(ProductDataDefault)
  const [productType, setProductType] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addProductOpen, setAddProductOpen] = useState<boolean>(false)
  const [editProductOpen, setEditProductOpen] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)

  const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
    const dispatch = useDispatch<AppDispatch>()

    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleEdit = async () => {
      const foundedProduct = store.data.find((product: ProductsType) => product._id === id)
      setCurrentProduct(foundedProduct!)
      setEditProductOpen(true)
      handleRowOptionsClose()
    }

    const handleDelete = () => {
      dispatch(deleteProduct({ id }))
      handleRowOptionsClose()
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <DotsVertical />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={handleEdit}>
            <PencilOutline fontSize='small' sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

  // @ts-ignore
  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: 'Product',
      renderCell: ({ row }: CellType) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {RenderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component='a'
                variant='subtitle2'
                sx={{ color: 'text.primary', textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => handleRoute(router, `/stores/view/${row.id}`)}
              >
                {name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'serial_number',
      minWidth: 250,
      headerName: 'Serial Number',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.serialNumber}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'productType',
      headerName: 'Product Type',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.productType}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'price',
      minWidth: 250,
      headerName: 'Price',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.price}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'quantity',
      minWidth: 150,
      headerName: 'Quantity',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.quantity}
          </Typography>
        )
      }
    }
  ]

  if (!router.pathname.includes('/products')) {
    columns.push({
      flex: 0.1,
      minWidth: 90,
      // sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
    })
  }

  const auth = useAuth()
  useEffect(() => {
    const fetchAll = async () => {
      const { user }: any = auth
      await dispatch(fetchURLForProducts({}))
      dispatch(
        fetchData({
          productType,
          store: user.store
        })
      )
    }
    fetchAll()
  }, [dispatch, productType])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleProductTypeChange = useCallback((e: SelectChangeEvent) => {
    setProductType(e.target.value)
  }, [])

  const toggleAddProductDrawer = () => setAddProductOpen(!addProductOpen)
  const toggleEditProductDrawer = () => setEditProductOpen(!editProductOpen)

  useEffect(() => {
    if (!editProductOpen) {
      setCurrentProduct(ProductDataDefault)
    }
  }, [editProductOpen])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='store-select'>Select Product Type</InputLabel>
                  <Select
                    fullWidth
                    value={productType}
                    id='select-store-type'
                    label='Select Product Type'
                    labelId='store-type-select'
                    onChange={handleProductTypeChange}
                    inputProps={{ placeholder: 'Select Product Type' }}
                  >
                    <MenuItem value=''>Select Product Type</MenuItem>
                    <MenuItem value='commercial'>Commercial</MenuItem>
                    <MenuItem value='demo'>Demo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddProductDrawer} />
          <DataGrid
            autoHeight
            rows={store.data ?? []}
            getRowId={(row: any) => row._id}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      {!router.pathname.includes('/products') && (
        <>
          <AddProductDrawer open={addProductOpen} toggle={toggleAddProductDrawer} />
          <EditProductDrawer open={editProductOpen} toggle={toggleEditProductDrawer} data={currentProduct} />
        </>
      )}
    </Grid>
  )
}

Products.acl = {
  action: 'manage',
  subject: 'products'
}

export default Products
