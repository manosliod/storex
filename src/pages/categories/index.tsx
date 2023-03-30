// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

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
  // ** Hooks
  const auth = useAuth()
  const { user }: any = auth
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.categories)

  // ** State
  const [currentCategory, setCurrentCategory] = useState<CategoryData>(CategoryDataDefault)
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addCategoryOpen, setAddCategoryOpen] = useState<boolean>(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState<boolean>(false)

  // Handle Delete dialog
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const handleDeleteClickOpen = () => setOpenDelete(true)
  const handleDeleteClose = () => {
    setSelectedCategory(null)
    setOpenDelete(false)
  }
  const handleDeleteAuth = async () => {
    const storeId = user.store
    let dontFetch = 0
    if (router.pathname.includes('/categories/view')) {
      dontFetch = 1
    }
    const id = selectedCategory.id
    await dispatch(deleteCategory({ id, storeId, dontFetch }))
    if (router.pathname.includes('/categories/view')) dispatch(fetchCategoryData(currentCategoryData._id))
    handleDeleteClose()
  }

  const RowOptions = ({ id, name }: { id: number | string; name: string }) => {
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
      setSelectedCategory({ id, name })
      handleDeleteClickOpen()
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
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} name={row.name} />
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
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddCategoryDrawer}
            categoryData={currentCategoryData}
          />
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

      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby='category-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
        aria-describedby='category-view-edit-description'
      >
        <DialogTitle id='category-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          Delete {selectedCategory?.name ?? ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' id='category-view-edit-description' sx={{ textAlign: 'center' }}>
            Are you sure you want to delete this?
          </DialogContentText>
          <DialogContentText variant='body2' id='category-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            This will delete all the subcategories and the containing products!
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

Categories.acl = {
  action: 'manage',
  subject: 'categories'
}

export default Categories
