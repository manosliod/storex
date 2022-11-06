// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import {NextRouter} from "next/router";

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface params {
  id: string | null | number
  role: string
}

export const fetchURLForRoles = (role: any, id?: any, router?: any) => {
  if (
      (role === 'super-admin' || role === 'store-admin' || role === 'store-sub-admin') &&
      router !== '/profile'
  ) {
    return `/api/users/${id}`
  }

  return '/api/users/me'
}

export const fetchUserRole = createAsyncThunk('appCurrentUser/fetchUserRole', (data: any) => {
  return {
    role: data.user.role,
    pathname: data.router.pathname
  }
})

export const fetchUserData = createAsyncThunk(
  'appCurrentUser/fetchUserData',
  async (id: string | null | number, { getState, rejectWithValue }) => {
    let error = {}
    try {
      const { currentUser }: any = getState()
      console.log(currentUser, 'currentUser')
      const res = await axios.get(fetchURLForRoles(currentUser.role, id, currentUser.pathaname))

      // console.log(res, 'response')
      return {
        user: res.data.doc,
        allData: res.data,
        error: {}
      }
    } catch (err: any) {
      const { statusCode } = err.response.data
      if (statusCode === 404) {
        error = { ...err.response.data }
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
      const res = await axios.patch(fetchURLForRoles(currentUser.role, id, currentUser.pathaname), {
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
      }

      return rejectWithValue({ error })
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appCurrentUser/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const { currentUser }: any = getState()
    const response = await axios.delete(fetchURLForRoles(currentUser.role, id, currentUser.pathaname))

    dispatch(fetchUserData(id))

    return response.data
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
        state.pathname = action.payload.pathname
      })
      .addCase(fetchUserRole.rejected, (state, action: PayloadAction<{} | any>) => {
        state.role = 'user'
        state.pathname = ''
      })
  }
})

export default appCurrentUserSlice.reducer
