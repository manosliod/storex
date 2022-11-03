// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { UsersType } from 'src/types/apps/userTypes'

interface DataParams {
  q?: string
  role?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface ServerDataType {
  userData: UsersType
  userDataError: boolean
}

export const fetchDataFromServer = createAsyncThunk(
  'appCurrentUser/fetchDataFromServer',
  async (serverData: ServerDataType) => {
    const { userData, userDataError } = serverData
    return {
      user: { ...userData },
      total: 1,
      allData: { ...userData },
      error: { userDataError }
    }
  }
)

export const fetchUserData = createAsyncThunk('appCurrentUser/fetchUserData', async (id: string | number) => {
  const response = await axios.get(`/api/users/${id}`)
  console.log(response, 'fetchUserData')
  return {
    user: response.data.doc,
    allData: response.data
  }
})

export const editUser = createAsyncThunk(
  'appCurrentUser/editUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const id = data._id
    delete data._id
    const response = await axios.patch(`/api/users/${id}`, {
      ...data
    })

    return {
      user: response.data.doc,
      allData: response.data
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appCurrentUser/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`/api/users/${id}`)

    dispatch(fetchUserData(id))

    return response.data
  }
)

export const appCurrentUserSlice = createSlice({
  name: 'appCurrentUser',
  initialState: {
    data: [],
    params: {},
    allData: [],
    error: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.data = action.payload.user
      state.allData = action.payload.allData
    })
    builder.addCase(editUser.fulfilled, (state, action) => {
      console.log(action, 'action')
      state.data = action.payload.user
      state.allData = action.payload.allData
      console.log(state, 'state')
    })
    builder.addCase(editUser.rejected, (state, action) => {
      console.log(state, 'state')
      console.log(action, 'action')
      state.error = true
    })
  }
})

export default appCurrentUserSlice.reducer
