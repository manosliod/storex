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
import { fetchData, deleteCategory, fetchURLForRoles } from 'src/store/apps/categories'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CategoriesType } from 'src/types/apps/catgoryTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/categories/list/TableHeader'
import AddCategoryDrawer from 'src/views/apps/categories/list/AddCategoryDrawer'
import EditCategoryDrawer from 'src/views/apps/categories/list/EditCategoryDrawer'
import { NextRouter, useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'
import { fetchCategoryData } from '../../store/apps/currentCategory'

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
      { shallow: !router.pathname.includes('/categories/view') }
    )
  }
}

// ** renders client column
const RenderClient = (row: CategoriesType) => {
  const router = useRouter()

  return (
    <AvatarWithoutImageLink onClick={() => handleRoute(router, `/categories/view/${row._id}`)}>
      <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    </AvatarWithoutImageLink>
  )
}

interface Props {
  currentCategoryData: any
  subcategories: []
  techUsers: any
}

const Categories = ({ currentCategoryData, subcategories, techUsers }: Props) => {
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
      let foundedCategory: any
      if (currentCategoryData) {
        foundedCategory = subcategories.find((category: CategoriesType) => category._id === id)
      } else {
        foundedCategory = store.data.find((category: CategoriesType) => category._id === id)
      }
      setCurrentCategory(foundedCategory)
      setEditCategoryOpen(true)
      handleRowOptionsClose()
    }

    const handleDelete = async () => {
      let storeId
      let dontFetch = 0
      if (router.pathname.includes('/categories/view')) {
        dontFetch = 1
        storeId = user.store
      }
      await dispatch(deleteCategory({ id, storeId, dontFetch }))
      if (router.pathname.includes('/categories/view')) dispatch(fetchCategoryData(currentCategoryData._id))
      handleRowOptionsClose()
    }

    const { categories, role }: any = user
    return (
      <>
        <IconButton
          disabled={role === 'tech' && !categories.find((category: any) => category.toString() === id)}
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
                onClick={() => handleRoute(router, `/categories/view/${row._id}`)}
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
            {row.subcategories !== undefined ? row.subcategories.length : 0}
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
    const fetch = async () => {
      const data: any = {
        id: currentCategoryData?._id,
        router,
        storeId: user.store,
        role: user.role
      }
      await dispatch(fetchURLForRoles(data))
      if (!router.pathname.includes('/categories/view'))
        dispatch(
          fetchData({
            store: user.store
          })
        )
    }
    fetch()
  }, [dispatch, currentCategoryData])

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

  const [filteredData, setFilteredData] = useState([])
  useEffect(() => {
    if (subcategories !== undefined) {
      setFilteredData(subcategories.filter((category: any) => category.name.includes(value)))
    } else {
      if (store.data) setFilteredData(store.data.filter((category: any) => category.name.includes(value)))
    }
  }, [value, store.data, subcategories])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddCategoryDrawer} />
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

      <AddCategoryDrawer
        open={addCategoryOpen}
        toggle={toggleAddCategoryDrawer}
        techUsers={store.techUsers ?? techUsers}
        currentCategoryData={currentCategoryData}
      />
      <EditCategoryDrawer
        open={editCategoryOpen}
        toggle={toggleEditCategoryDrawer}
        data={currentCategory}
        techUsers={store.techUsers ?? techUsers}
        currentCategoryData={currentCategoryData}
      />
    </Grid>
  )
}

Categories.acl = {
  action: 'manage',
  subject: 'categories'
}

export default Categories
