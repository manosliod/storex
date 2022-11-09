// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, ReactElement } from 'react'

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
import Laptop from 'mdi-material-ui/Laptop'
import ChartDonut from 'mdi-material-ui/ChartDonut'
import CogOutline from 'mdi-material-ui/CogOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, setUrl, deleteUser, setUpdateDeleteUrl } from 'src/store/apps/user'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import EditUserDrawer from 'src/views/apps/user/list/EditUserDrawer'
import axios from 'axios'
import { NextRouter, useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

interface UserRoleType {
  [key: string]: ReactElement
}

interface UserData {
  _id: string | number
  username: string
  email: string
  fullName: string
  gender: string
  address: string
  city: string
  country: string
  birthday: string
  phone: string
  role: string
}

const UserDataDefault: UserData = {
  _id: '',
  username: '',
  email: '',
  fullName: '',
  gender: '',
  address: '',
  city: '',
  country: '',
  birthday: '',
  phone: '',
  role: ''
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: <Laptop sx={{ mr: 2, color: 'error.main' }} />,
  author: <CogOutline sx={{ mr: 2, color: 'warning.main' }} />,
  editor: <PencilOutline sx={{ mr: 2, color: 'info.main' }} />,
  maintainer: <ChartDonut sx={{ mr: 2, color: 'success.main' }} />,
  subscriber: <AccountOutline sx={{ mr: 2, color: 'primary.main' }} />
}

interface CellType {
  row: UsersType
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

const changeUserRoute = (userId: any, storeData: any, router: NextRouter) => {
  let url = `/users/${userId}`
  if (router.pathname.includes('/home')) {
    url = `/home/${storeData._id}/user/${userId}`
  } else if (storeData !== null) {
    url = `/stores/${storeData._id}/user/${userId}`
  }
  return url
}

const Users = ({ storeData = null }: any) => {
  // ** State
  const [currentUser, setCurrentUser] = useState<UserData>(UserDataDefault)
  const [role, setRole] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const { user }: any = auth
  const currentUserRole = user.role
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  // ** renders client column
  const RenderClient = (row: UsersType) => {
    return (
      <AvatarWithoutImageLink
        onClick={() => handleRoute(router, changeUserRoute(row.username!.toString(), storeData, router))}
      >
        <CustomAvatar skin='light' color='primary' sx={{ width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}>
          {getInitials(row.fullName ? row.fullName : 'John Doe')}
        </CustomAvatar>
      </AvatarWithoutImageLink>
    )
  }

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
      let url = `/api/users/${id}`
      if (storeData !== null) {
        url = `/api/users/${id}/store/${storeData._id}`
      }
      const response = await axios.get(url)
      setCurrentUser(response.data.doc)
      setEditUserOpen(true)
      handleRowOptionsClose()
    }

    const handleDelete = async () => {
      if (storeData !== null) {
        await dispatch(setUpdateDeleteUrl(`/api/users/${id}/store/${storeData._id}`))
      } else {
        await dispatch(setUpdateDeleteUrl(`/api/users/${id}`))
      }
      dispatch(deleteUser(id))
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
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        const { fullName, username } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {RenderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component='a'
                variant='subtitle2'
                sx={{ color: 'text.primary', textDecoration: 'none', cursor: 'pointer' }}
                onClick={() =>
                  handleRoute(router, changeUserRoute(row.username!.toString(), storeData, router), {
                    id: row._id
                  })
                }
              >
                {fullName}
              </Typography>
              <Typography
                noWrap
                component='a'
                variant='caption'
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() =>
                  handleRoute(router, changeUserRoute(row.username!.toString(), storeData, router), {
                    id: row._id
                  })
                }
              >
                @{username}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 150,
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userRoleObj[row.role]}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.role}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'address',
      minWidth: 150,
      headerName: 'Address',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.address}
            </Typography>
          </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.city}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'phone',
      minWidth: 150,
      headerName: 'Phone',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.phone}
            </Typography>
          </Box>
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
    const initUsers = async () => {
      if (storeData !== null) await dispatch(setUrl(`/api/users/store/${storeData.id}`))
      dispatch(
        fetchData({
          role
        })
      )
    }
    initUsers()
  }, [dispatch, role, storeData])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)

  useEffect(() => {
    if (!editUserOpen) {
      setCurrentUser(UserDataDefault)
    }
  }, [editUserOpen])

  const [filteredData, setFilteredData] = useState([])
  useEffect(() => {
    setFilteredData(
      store.data.filter(
        (storeData: any) =>
          storeData.fullName.includes(value) ||
          storeData.username.includes(value) ||
          storeData.email.includes(value) ||
          storeData.address.includes(value) ||
          storeData.city.includes(value) ||
          storeData.phone.includes(value)
      )
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
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    {currentUserRole === 'super-admin' && <MenuItem value='super-admin'>Super Admin</MenuItem>}
                    <MenuItem value='store-admin'>Store Admin</MenuItem>
                    <MenuItem value='store-sub-admin'>Store Sub-Admin</MenuItem>
                    <MenuItem value='lead-tech'>Lead Tech</MenuItem>
                    <MenuItem value='accountant'>Accountant</MenuItem>
                    <MenuItem value='salesman'>Salesman</MenuItem>
                    <MenuItem value='tech'>Tech</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
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

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
      <EditUserDrawer open={editUserOpen} toggle={toggleEditUserDrawer} data={currentUser} storeData={storeData} />
    </Grid>
  )
}

Users.acl = {
  action: 'manage',
  subject: 'users'
}

export default Users
