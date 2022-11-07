// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { NextRouter } from 'next/router'

interface data {
  role: any
  id: any
  router: NextRouter
  storeId: any
}

export const fetchURLForRoles = createAsyncThunk('appCurrentUser/fetchURLForRoles', (data: data) => {
  if (data.role === null || data.router === null || data.storeId === null) {
    return '/api/users/me'
  } else if (data.router.pathname.includes('/stores') && data.storeId !== null) {
    return `/api/stores/${data.storeId}/user/${data.id}`
  } else if (
    (data.role === 'super-admin' || data.role === 'store-admin' || data.role === 'store-sub-admin') &&
    !data.router.pathname.includes('/profile')
  ) {
    return `/api/users/${data.id}`
  }

  return '/api/users/me'
})

export const fetchUserRole = createAsyncThunk('appCurrentUser/fetchUserRole', (data: any) => {
  return {
    role: data
  }
})

export const fetchUserData = createAsyncThunk(
  'appCurrentUser/fetchUserData',
  async (id: string | null | number, { getState, rejectWithValue }) => {
    let error = {}
    try {
      const { currentUser }: any = getState()
      const res = await axios.get(currentUser.pathname)

      return {
        user: res.data.doc,
        allData: res.data,
        error: {}
      }
    } catch (err: any) {
      const { statusCode } = err.response.data
      if (statusCode === 404) {
        error = { ...err.response.data }
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
  'appCurrentUser/editUser',
  async (data: { [key: string]: number | string }, { getState, rejectWithValue }) => {
    const id = data._id
    delete data._id
    let error = {}
    try {
      const { currentUser }: any = getState()
      const res = await axios.patch(currentUser.pathname, {
        ...data
      })

      return {
        user: res.data.doc,
        allData: res.data,
        error: {}
      }
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
  'appCurrentUser/deleteUser',
  async (id: number | string, { getState, dispatch, rejectWithValue }) => {
    let error = {}
    try {
      const { currentUser }: any = getState()
      const res = await axios.delete(currentUser.pathname)

      return {
        user: res.data.doc,
        allData: res.data,
        error: {}
      }
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

export const updatePassword = createAsyncThunk(
  'appCurrentUserSlice/updatePassWord',
  async (data: any, { rejectWithValue }) => {
    let error
    try {
      const res = await axios.patch('/api/users/updateMyPassword', data)
      return res.data
    } catch (err: any) {
      const { status, statusCode, message } = err.response.data
      if (message.includes('`password`')) {
        error = {
          type: 'password',
          message: message
        }
      } else if (statusCode === 401) {
        error = {
          statusCode,
          status,
          message
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

export const appCurrentUserSlice = createSlice({
  name: 'appCurrentUser',
  initialState: {
    pathname: '',
    role: 'user',
    data: [],
    params: {},
    allData: [],
    error: {
      statusCode: {}
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<{} | any>) => {
        console.log(action.payload, 'payload')
        state.data = action.payload.user
        state.allData = action.payload.allData
      })
      .addCase(fetchUserData.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.user
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(editUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(fetchUserRole.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.role = action.payload.role
      })
      .addCase(fetchUserRole.rejected, (state, action: PayloadAction<{} | any>) => {
        state.role = 'user'
      })
      .addCase(fetchURLForRoles.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.pathname = action.payload
      })
      .addCase(fetchURLForRoles.rejected, (state, action: PayloadAction<{} | any>) => {
        state.pathname = ''
      })
      .addCase(updatePassword.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.error = {
          statusCode: 200
        }
      })
      .addCase(updatePassword.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = {
          ...action.payload.error
        }
      })
  }
})

export default appCurrentUserSlice.reducer
