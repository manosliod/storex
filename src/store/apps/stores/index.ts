// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

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

  const jsonObj = {
    stores: response.data.data,
    total: response.data.results,
    params: params,
    allData: response.data
  }

  return jsonObj
})

// ** Add Store
export const addStore = createAsyncThunk(
  'appStores/addStore',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    let returnObj
    await axios
      .post('/api/stores', {
        ...data
      })
      .then(res => {
        returnObj = {
          ...res.data
        }
      })
      .catch(er => {
        returnObj = {
          error: {
            type: er.response.data.message.split('/type:')[1],
            message: 'Value already in use!'
          }
        }
      })

    //@ts-ignore
    if (returnObj.error) return

    dispatch(fetchData(getState().stores.params))

    return returnObj
  }
)

export const editStore = createAsyncThunk(
  'appStores/editStore',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    let returnObj
    const id = data._id
    delete data._id
    await axios
      .patch(`/api/stores/${id}`, {
        ...data
      })
      .then(res => {
        returnObj = {
          ...res.data
        }
      })
      .catch(er => {
        returnObj = {
          error: {
            type: er.response.data.message.split('/type:')[1],
            message: 'Value already in use!'
          }
        }
      })

    //@ts-ignore
    if (returnObj.error) return

    dispatch(fetchData(getState().stores.params))

    return returnObj
  }
)

// ** Delete Store
export const deleteStore = createAsyncThunk(
  'appStores/deleteStore',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`/api/stores/${id}`)

    dispatch(fetchData(getState().stores.params))

    return response.data
  }
)

export const appStoresSlice = createSlice({
  name: 'appStores',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    error: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.stores
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appStoresSlice.reducer
