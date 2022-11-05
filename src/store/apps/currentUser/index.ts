// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const fetchUserData = createAsyncThunk(
  'appCurrentUser/fetchUserData',
  async (id: string | null | number, { rejectWithValue }) => {
    let error = {}
    try {
      const res = await axios.get(`/api/users/${id}`)

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
  async (data: { [key: string]: number | string }, { rejectWithValue }) => {
    const id = data._id
    delete data._id
    let error = {}
    try {
      const res = await axios.patch(`/api/users/${id}`, {
        ...data
      })

      return {
        user: res.data.doc,
        allData: res.data,
        error: {}
      }
    } catch (err: any) {
      const { message } = err.response.data
      if (message.includes('type:')) {
        error = {
          type: message.split('type:')[1],
          message: message.split('type:')[0]
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
  async (id: number | string, { dispatch }: Redux) => {
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
  }
})

export default appCurrentUserSlice.reducer
