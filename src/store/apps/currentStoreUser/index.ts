// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface ParamTypes {
  id?: any
  data?: any
  storeId: any
}

export const fetchStoreUserData = createAsyncThunk(
  'appCurrentStore/fetchStoreUserData',
  async (params: ParamTypes, { rejectWithValue }) => {
    let error = {}
    try {
      const res = await axios.get(`/api/users/${params.id}/store/${params.storeId}`)

      // console.log(res, 'response')
      return {
        store: res.data.doc,
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

export const editStoreUser = createAsyncThunk(
  'appCurrentStore/editStoreUser',
  async (params: ParamTypes, { rejectWithValue }) => {
    delete params.data._id
    let error = {}
    try {
      const res = await axios.patch(`/api/users/${params.id}/store/${params.storeId}`, {
        ...params.data
      })

      return {
        store: res.data.doc,
        allData: res.data,
        error: {}
      }
    } catch (err: any) {
      const { message } = err.response.data
      if (message?.includes('/type:')) {
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

export const appCurrentStoreUserSlice = createSlice({
  name: 'appCurrentStoreUser',
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
      .addCase(fetchStoreUserData.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.store
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(fetchStoreUserData.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editStoreUser.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.store
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(editStoreUser.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
  }
})

export default appCurrentStoreUserSlice.reducer
