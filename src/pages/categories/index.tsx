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
import { fetchData, deleteCategory } from 'src/store/apps/categories'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CategoriesType } from 'src/types/apps/catgoryTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/categories/list/TableHeader'
import AddCategoryDrawer from 'src/views/apps/categories/list/AddCategoryDrawer'
import EditCategoryDrawer from 'src/views/apps/categories/list/EditCategoryDrawer'
import { NextRouter, useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'

interface CategoryData {
  name?: string
  user: any
}

const CategoryDataDefault: CategoryData = {
  name: '',
  user: ''
}

interface CellType {
  row: CategoriesType
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
const RenderClient = (row: CategoriesType) => {
  const router = useRouter()

  return (
    <AvatarWithoutImageLink onClick={() => handleRoute(router, `/categories/view/${row.id}`)}>
      <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    </AvatarWithoutImageLink>
  )
}

const Categories = ({ users }: any) => {
  // ** State
  const [currentCategory, setCurrentCategory] = useState<CategoryData>(CategoryDataDefault)
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addCategoryOpen, setAddCategoryOpen] = useState<boolean>(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const { user }: any = auth
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.categories)

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
      const foundedCategory = store.data.find((category: CategoriesType) => category._id === id)
      setCurrentCategory(foundedCategory!)
      setEditCategoryOpen(true)
      handleRowOptionsClose()
    }

    const handleDelete = () => {
      dispatch(deleteCategory(id))
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
      headerName: 'Category',
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
                onClick={() => handleRoute(router, `/categories/view/${row.id}`)}
              >
                {name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'subCategories',
      headerName: 'Sub Categories',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.subCategories !== undefined ? row.subCategories.length : 0}
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
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
    }
  ]

  useEffect(() => {
    dispatch(
      fetchData({
        q: value,
        store: user.store
      })
    )
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddCategoryDrawer = () => setAddCategoryOpen(!addCategoryOpen)
  const toggleEditCategoryDrawer = () => setEditCategoryOpen(!editCategoryOpen)

  useEffect(() => {
    if (!editCategoryOpen) {
      setCurrentCategory(CategoryDataDefault)
    }
  }, [editCategoryOpen])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddCategoryDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
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

      <AddCategoryDrawer open={addCategoryOpen} toggle={toggleAddCategoryDrawer} techUsers={store.availableTechUsers} />
      <EditCategoryDrawer
        open={editCategoryOpen}
        toggle={toggleEditCategoryDrawer}
        data={currentCategory}
        techUsers={store.techUsers}
      />
    </Grid>
  )
}

Categories.acl = {
  action: 'manage',
  subject: 'categories'
}

export default Categories
