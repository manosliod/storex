// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { addUser, editUser } from '../user'

interface DataParams {
  q?: string
  storeType?: string
  city?: string
  country?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Stores
export const fetchData = createAsyncThunk('appStores/fetchData', async (params: DataParams) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
    if (params.hasOwnProperty('storeType') && !Object.keys(params.storeType!).length) {
      delete params.storeType
    }
    if (params.hasOwnProperty('city') && !Object.keys(params.city!).length) {
      delete params.city
    }
    if (params.hasOwnProperty('country') && !Object.keys(params.country!).length) {
      delete params.country
    }
  }

  const response = await axios.get('/api/stores', {
    params
  })

  return {
    stores: response.data.data,
    total: response.data.results,
    params: params,
    allData: response.data
  }
})

// ** Add Store
export const addStore = createAsyncThunk(
  'appStores/addStore',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const res = await axios.post('/api/stores', {
        ...data
      })
      const { stores }: any = getState()
      dispatch(fetchData(stores.params))

      return { ...res.data }
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

export const editStore = createAsyncThunk(
  'appStores/editStore',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const res = await axios.patch(`/api/stores/${data.id}`, {
        ...data
      })
      const { stores }: any = getState()
      dispatch(fetchData(stores.params))

      return { ...res.data }
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
  'appStores/deleteStore',
  async (id: number | string, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const res = await axios.delete(`/api/stores/${id}`)
      const { stores }: any = getState()
      dispatch(fetchData(stores.params))

      return { ...res.data }
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

export const appStoresSlice = createSlice({
  name: 'appStores',
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
        state.data = action.payload.stores
        state.total = action.payload.total
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.error = error
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(addStore.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editStore.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(editStore.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(deleteStore.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
  }
})

export default appStoresSlice.reducer
