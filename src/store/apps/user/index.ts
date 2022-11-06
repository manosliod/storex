// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q?: string
  role?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
    if (params.hasOwnProperty('role') && !Object.keys(params.role!).length) {
      delete params.role
    }
  }

  const response = await axios.get('/api/users', {
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
      const res = await axios.post('/api/users', {
        ...data
      })
      const { user }: any = getState()
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
      }

      return rejectWithValue({ error })
    }
  }
)

export const editUser = createAsyncThunk(
  'appUsers/editUser',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    const id = data._id
    delete data._id
    let error
    try {
      const res = await axios.patch(`/api/users/${id}`, {
        ...data
      })
      const { user }: any = getState()
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
      }

      return rejectWithValue({ error })
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`/api/users/${id}`)

    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

interface error {
  type?: {}
  message?: {}
}
export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
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
      .addCase(addUser.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(addUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(editUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
  }
})

export default appUsersSlice.reducer
