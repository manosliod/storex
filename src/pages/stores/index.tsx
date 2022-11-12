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
import { fetchData, deleteStore } from 'src/store/apps/stores'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { StoresType } from 'src/types/apps/storeTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/stores/list/TableHeader'
import AddStoreDrawer from 'src/views/apps/stores/list/AddStoreDrawer'
import EditStoreDrawer from 'src/views/apps/stores/list/EditStoreDrawer'
import TextField from '@mui/material/TextField'
import { NextRouter, useRouter } from 'next/router'
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {deleteCategory} from "../../store/apps/categories";
import {fetchCategoryData} from "../../store/apps/currentCategory";

interface StoreData {
  name?: string
  officialName?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
}

const StoreDataDefault: StoreData = {
  name: '',
  officialName: '',
  storeType: '',
  address: '',
  city: '',
  country: ''
}

interface CellType {
  row: StoresType
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
const RenderClient = (row: StoresType) => {
  const router = useRouter()

  return (
    <AvatarWithoutImageLink onClick={() => handleRoute(router, `/stores/view/${row.id}`)}>
      <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    </AvatarWithoutImageLink>
  )
}

const Stores = () => {
  // ** State
  const [currentStore, setCurrentStore] = useState<StoreData>(StoreDataDefault)
  const [storeType, setStoreType] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addStoreOpen, setAddStoreOpen] = useState<boolean>(false)
  const [editStoreOpen, setEditStoreOpen] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.stores)

  // Handle Delete dialog
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const handleDeleteClickOpen = () => setOpenDelete(true)
  const handleDeleteClose = () => {
    setSelectedStore(null)
    setOpenDelete(false)
  }
  const handleDeleteAuth = async () => {
    const id = selectedStore.id
    dispatch(deleteStore(id))
    handleDeleteClose()
  }

  const RowOptions = ({ id, name }: { id: number | string, name?: string }) => {
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
      const foundedStore = store.data.find((store: StoresType) => store._id === id)
      setCurrentStore(foundedStore!)
      setEditStoreOpen(true)
      handleRowOptionsClose()
    }

    const handleDelete = () => {
      setSelectedStore({id, name})
      handleDeleteClickOpen()
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
      headerName: 'Store',
      renderCell: ({ row }: CellType) => {
        const { name, officialName } = row

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
              <Typography
                noWrap
                component='a'
                variant='caption'
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => handleRoute(router, `/stores/view/${row.id}`)}
              >
                {officialName}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'storeType',
      headerName: 'Store Type',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.storeType}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'address',
      minWidth: 250,
      headerName: 'Address',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.address}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'city',
      minWidth: 150,
      headerName: 'City',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.city}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'country',
      minWidth: 150,
      headerName: 'Country',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.country}
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
    dispatch(
      fetchData({
        storeType,
        city,
        country
      })
    )
  }, [dispatch, storeType, city, country])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleStoreTypeChange = useCallback((e: SelectChangeEvent) => {
    setStoreType(e.target.value)
  }, [])

  const toggleAddStoreDrawer = () => setAddStoreOpen(!addStoreOpen)
  const toggleEditStoreDrawer = () => setEditStoreOpen(!editStoreOpen)

  useEffect(() => {
    if (!editStoreOpen) {
      setCurrentStore(StoreDataDefault)
    }
  }, [editStoreOpen])

  const [filteredData, setFilteredData] = useState([])
  useEffect(() => {
    console.log(filteredData)
    setFilteredData(
      store.data.filter((storeData: any) => storeData.name.includes(value) || storeData.officialName.includes(value))
    )
  }, [value, store.data])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='store-select'>Select Store Type</InputLabel>
                  <Select
                    fullWidth
                    value={storeType}
                    id='select-store-type'
                    label='Select Store Type'
                    labelId='store-type-select'
                    onChange={handleStoreTypeChange}
                    inputProps={{ placeholder: 'Select Store Type' }}
                  >
                    <MenuItem value=''>Select Store Type</MenuItem>
                    <MenuItem value='individual'>Individual</MenuItem>
                    <MenuItem value='branch'>Branch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <TextField size='medium' value={city} placeholder='City' onChange={e => setCity(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    size='medium'
                    value={country}
                    placeholder='Country'
                    onChange={e => setCountry(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddStoreDrawer} />
          <DataGrid
            autoHeight
            rows={filteredData ?? store.data}
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

      <AddStoreDrawer open={addStoreOpen} toggle={toggleAddStoreDrawer} />
      <EditStoreDrawer open={editStoreOpen} toggle={toggleEditStoreDrawer} data={currentStore} />
      <Dialog
          open={openDelete}
          onClose={handleDeleteClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
          aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          Delete {selectedStore?.name ?? ''}
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

Stores.acl = {
  action: 'manage',
  subject: 'stores'
}

export default Stores
