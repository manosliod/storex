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
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

interface ProductData {
  name: string
  serialNumber: number
  price: number
  quantity: number
  productType: string
}

const ProductDataDefault: ProductData = {
  name: '',
  serialNumber: Number(''),
  price: Number(''),
  quantity: Number(''),
  productType: ''
}

interface CellType {
  row: ProductsType
}

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Grid)(({ theme }) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3)
}))

// ** renders client column
const RenderClient = (row: ProductsType) => {
  const router = useRouter()

  return (
    <AvatarWithoutImageLink>
      <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    </AvatarWithoutImageLink>
  )
}

const Products = ({ category }: any | undefined) => {
  // ** State
  const [currentProduct, setCurrentProduct] = useState<ProductData>(ProductDataDefault)
  const [productType, setProductType] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addProductOpen, setAddProductOpen] = useState<boolean>(false)
  const [editProductOpen, setEditProductOpen] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const { user }: any = auth
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)

  // Handle Delete dialog
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const handleDeleteClickOpen = () => setOpenDelete(true)
  const handleDeleteClose = () => {
    setSelectedProduct(null)
    setOpenDelete(false)
  }
  const handleDeleteAuth = () => {
    dispatch(deleteProduct({ id: selectedProduct.id, store: user.store }))
    handleDeleteClose()
  }

  const RowOptions = ({ id, name }: { id: number | string; name: string | undefined }) => {
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
      setSelectedProduct({ id, name })
      handleDeleteClickOpen()
      handleRowOptionsClose()
    }

    const { products, role }: any = auth.user
    return (
      <>
        <IconButton
          disabled={role === 'tech' && !products.find((product: any) => product.toString() === id)}
          size='small'
          onClick={handleRowOptionsClick}
        >
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
                sx={{ color: 'text.primary', textDecoration: 'none' }}
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
      minWidth: 100,
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
      minWidth: 100,
      headerName: 'Quantity',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.quantity}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} name={row.name} />
    }
  ]

  useEffect(() => {
    const fetchAll = async () => {
      const { user }: any = auth
      await dispatch(fetchURLForProducts({}))
      dispatch(
        fetchData({
          productType,
          store: user.store,
          category: category?._id
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
              <Grid item sm={6} xs={12}>
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
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddProductDrawer}
            categoryData={category}
          />
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

      <AddProductDrawer open={addProductOpen} toggle={toggleAddProductDrawer} category={category?._id ?? ''} />
      <EditProductDrawer open={editProductOpen} toggle={toggleEditProductDrawer} data={currentProduct} />

      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          Delete {selectedProduct?.name ?? ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Are you sure you want to delete this?
          </DialogContentText>
          <Grid container sx={{ justifyContent: 'center' }}>
            <Button color='error' variant='contained' sx={{ mr: 3 }} onClick={handleDeleteAuth}>
              Delete
            </Button>
            <Button variant='outlined' onClick={handleDeleteClose}>
              Cancel
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

Products.acl = {
  action: 'manage',
  subject: 'products'
}

export default Products
