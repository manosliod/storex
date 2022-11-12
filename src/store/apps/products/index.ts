// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { NextRouter } from 'next/router'

interface DataParams {
  q?: string
  productType?: string
  store: any
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface data {
  id?: any | undefined
  router?: NextRouter | undefined
  storeId?: any | undefined
}

export const fetchURLForProducts = createAsyncThunk('appCurrentProduct/fetchURLForRoles', (data: data) => {
  if (data.router) {
    const { pathname }: any = data.router
    if (pathname.includes('/products/view') || pathname.includes('/home/product')) {
      return {
        pathname: `/api/stores/${data.storeId}/product/${data.id}`,
        categoriesPathname: ``
      }
    }
  }

  return {
    pathname: `/api/products`
  }
})

// ** Fetch Categories
export const fetchData = createAsyncThunk('appCategories/fetchData', async (params: DataParams, { getState }) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
    if (params.hasOwnProperty('productType') && !Object.keys(params.productType!).length) {
      delete params.productType
    }
  }
  const { products }: any = getState()
  const response = await axios.get(products.pathname, {
    params
  })

  return {
    products: response.data.data,
    total: response.data.results,
    params: params,
    allData: response.data
  }
})

// ** Add Product
export const addProduct = createAsyncThunk(
  'appCategories/addProduct',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const { products }: any = getState()
      const res = await axios.post(products.pathname, {
        ...data
      })
      if (data.dontFetch === undefined || data.dontFetch === 0) dispatch(fetchData(products.params))

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

export const editProduct = createAsyncThunk(
  'appCategories/editProduct',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const res = await axios.patch(`/api/products/${data._id}`, {
        ...data
      })
      const { products }: any = getState()
      if (data.dontFetch === undefined || data.dontFetch === 0) dispatch(fetchData(products.params))

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

// ** Delete Product
export const deleteProduct = createAsyncThunk(
  'appCategories/deleteProduct',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      let res
      if (data.storeId) {
        res = await axios.delete(`/api/stores/${data.storeId}/product/${data.id}`)
      } else {
        res = await axios.delete(`/api/products/${data.id}`)
      }
      const { products }: any = getState()
      dispatch(fetchData(products.params))

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

export const appCategoriesSlice = createSlice({
  name: 'appCategories',
  initialState: {
    pathname: '',
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
        state.data = action.payload.products
        state.total = action.payload.total
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.error = error
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(addProduct.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(editProduct.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(deleteProduct.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(fetchURLForProducts.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.pathname = action.payload.pathname
      })
      .addCase(fetchURLForProducts.rejected, (state, action: PayloadAction<{} | any>) => {
        state.pathname = ''
      })
  }
})

export default appCategoriesSlice.reducer
