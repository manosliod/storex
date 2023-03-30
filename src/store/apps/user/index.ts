// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q?: string
  role?: string
}

export const setUrl = createAsyncThunk('appCurrentUser/setUrl', (url: any) => {
  return {
    pathname: url
  }
})

export const setUpdateDeleteUrl = createAsyncThunk('appCurrentUser/setUpdateDeleteUrl', (url: any) => {
  return {
    pathnameUpdateDelete: url
  }
})

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams, { getState }) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
    if (params.hasOwnProperty('role') && !Object.keys(params.role!).length) {
      delete params.role
    }
  }

  const { user }: any = getState()
  const response = await axios.get(user.pathname, {
    params
  })

  return {
    users: response.data.data,
    total: response.data.results,
    params: params,
    allData: response.data
  }
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { dispatch, getState, rejectWithValue }) => {
    let error

    try {
      const { user }: any = getState()
      const res = await axios.post(user.pathname, {
        ...data
      })
      dispatch(fetchData(user.params))

      return { ...res.data }
    } catch (err: any) {
      const { message } = err.response.data
      if (message.includes('/type:')) {
        error = {
          type: message.split('/type:')[1],
          message: message.split('/type:')[0]
        }
      } else {
        error = {
          type: 'fail',
          message: 'Something Went Wrong! Please refresh your page!\n If the error exists contact with us.'
        }
      }

      return rejectWithValue({ error })
    }
  }
)

export const signupUser = createAsyncThunk(
  'appUsers/signupUser',
  async (data: { [key: string]: number | string }, { dispatch, getState, rejectWithValue }) => {
    let error

    try {
      const { user }: any = getState()
      const res = await axios.post(user.pathname, {
        ...data
      })
      dispatch(fetchData(user.params))

      return { ...res.data }
    } catch (err: any) {
      const { message } = err.response.data
      if (message.includes('/type:')) {
        error = {
          type: message.split('/type:')[1],
          message: message.split('/type:')[0]
        }
      } else {
        error = {
          type: 'fail',
          message: 'Something Went Wrong! Please refresh your page!\n If the error exists contact with us.'
        }
      }

      return rejectWithValue({ error })
    }
  }
)

export const editUser = createAsyncThunk(
  'appUsers/editUser',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    delete data._id
    let error
    try {
      const { user }: any = getState()
      const res = await axios.patch(user.pathnameUpdateDelete, {
        ...data
      })
      dispatch(fetchData(user.params))

      return { ...res.data }
    } catch (err: any) {
      const { message } = err.response.data
      if (message.includes('/type:')) {
        error = {
          type: message.split('/type:')[1],
          message: message.split('/type:')[0]
        }
      } else {
        error = {
          type: 'fail',
          message: 'Something Went Wrong! Please refresh your page!\n If the error exists contact with us.'
        }
      }

      return rejectWithValue({ error })
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const { user }: any = getState()
      const res = await axios.delete(user.pathnameUpdateDelete)
      dispatch(fetchData(user.params))

      return { ...res.data }
    } catch (err: any) {
      const { message } = err.response.data
      if (message.includes('/type:')) {
        error = {
          type: message.split('/type:')[1],
          message: message.split('/type:')[0]
        }
      } else {
        error = {
          type: 'fail',
          message: 'Something Went Wrong! Please refresh your page!\n If the error exists contact with us.'
        }
      }

      return rejectWithValue({ error })
    }
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    pathname: '/api/users',
    pathnameUpdateDelete: '',
    data: [],
    total: 1,
    params: {},
    allData: [],
    error: {
      type: '',
      message: ''
    }
  },
  reducers: {},
  extraReducers: builder => {
    const error = {
      type: '',
      message: ''
    }
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload.users
        state.total = action.payload.total
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.error = error
      })
      .addCase(addUser.fulfilled, (state ) => {
        state.error = error
      })
      .addCase(addUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(signupUser.fulfilled, (state ) => {
        state.error = error
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload?.error
      })
      .addCase(editUser.fulfilled, (state ) => {
        state.error = error
      })
      .addCase(editUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(deleteUser.fulfilled, (state ) => {
        state.error = error
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(setUrl.fulfilled, (state, action) => {
        state.pathname = action.payload.pathname
      })
      .addCase(setUrl.rejected, (state) => {
        state.pathname = '/api/users'
      })
      .addCase(setUpdateDeleteUrl.fulfilled, (state, action) => {
        state.pathnameUpdateDelete = action.payload.pathnameUpdateDelete
      })
      .addCase(setUpdateDeleteUrl.rejected, (state) => {
        state.pathname = ''
      })
  }
})

export default appUsersSlice.reducer
