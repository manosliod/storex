// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const fetchStoreData = createAsyncThunk(
  'appCurrentStore/fetchStoreData',
  async (id: string | null | number, { rejectWithValue }) => {
    let error = {}
    try {
      const res = await axios.get(`/api/stores/${id}`)

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

export const editStore = createAsyncThunk(
  'appCurrentStore/editStore',
  async (data: { [key: string]: number | string }, { rejectWithValue }) => {
    const id = data._id
    delete data._id
    let error = {}
    try {
      const res = await axios.patch(`/api/stores/${id}`, {
        ...data
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

// ** Delete Store
export const deleteStore = createAsyncThunk(
  'appCurrentStore/deleteStore',
  async (id: number | string, { dispatch }: Redux) => {
    const response = await axios.delete(`/api/stores/${id}`)

    dispatch(fetchStoreData(id))

    return response.data
  }
)

export const appCurrentStoreSlice = createSlice({
  name: 'appCurrentStore',
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
      .addCase(fetchStoreData.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.store
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(fetchStoreData.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editStore.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.store
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(editStore.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
  }
})

export default appCurrentStoreSlice.reducer
