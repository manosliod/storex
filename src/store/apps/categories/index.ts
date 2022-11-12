// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { NextRouter } from 'next/router'

interface DataParams {
  q?: string
  store: string | number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface data {
  id: any
  router: NextRouter
  storeId: any
  role?: any
}

export const fetchURLForRoles = createAsyncThunk('appCurrentCategory/fetchURLForRoles', (data: data) => {
  if (data.router.pathname.includes('/categories/view') || data.router.pathname.includes('/home/category')) {
    return {
      pathname: `/api/stores/${data.storeId}/category/${data.id}`,
      techUsersPathname:
        data.role === 'salesman' || data.role === 'accountant' || data.role === 'user'
          ? ''
          : `/api/users/store/${data.storeId}?role=tech`
    }
  }

  return {
    pathname: `/api/categories`,
    techUsersPathname:
      data.role === 'salesman' || data.role === 'accountant' || data.role === 'user'
        ? ''
        : `/api/users/store/${data.storeId}?role=tech`
  }
})

// ** Fetch Categories
export const fetchData = createAsyncThunk('appCategories/fetchData', async (params: DataParams, { getState }) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
  }
  const { categories }: any = getState()
  const response = await axios.get(categories.pathname, {
    params
  })
  let response_2
  if (categories.techUsersPathname !== '') response_2 = await axios.get(categories.techUsersPathname)

  return {
    categories: response.data.data,
    techUsers: response_2 ? response_2.data.data : '',
    total: response.data.results,
    params: params,
    allData: response.data
  }
})

// ** Add Category
export const addCategory = createAsyncThunk(
  'appCategories/addCategory',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const { categories }: any = getState()
      const res = await axios.post(categories.pathname, {
        ...data
      })
      if (data.dontFetch === 0) dispatch(fetchData(categories.params))

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

export const editCategory = createAsyncThunk(
  'appCategories/editCategory',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      const res = await axios.patch(`/api/categories/${data._id}`, {
        ...data
      })
      const { categories }: any = getState()
      if (data.dontFetch === 0) dispatch(fetchData(categories.params))

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

// ** Delete Category
export const deleteCategory = createAsyncThunk(
  'appCategories/deleteCategory',
  async (data: { [key: string]: number | string }, { getState, dispatch, rejectWithValue }) => {
    let error
    try {
      let res
      if (data.storeId) {
        res = await axios.delete(`/api/stores/${data.storeId}/category/${data.id}`)
      } else {
        res = await axios.delete(`/api/categories/${data.id}`)
      }
      const { categories }: any = getState()
      dispatch(fetchData(categories.params))

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
    techUsersPathname: '',
    techUsers: [],
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
        state.data = action.payload.categories
        state.techUsers = action.payload.techUsers
        state.total = action.payload.total
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.error = error
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(addCategory.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(editCategory.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.error = error
      })
      .addCase(deleteCategory.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(fetchURLForRoles.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.pathname = action.payload.pathname
        state.techUsersPathname = action.payload.techUsersPathname
      })
      .addCase(fetchURLForRoles.rejected, (state, action: PayloadAction<{} | any>) => {
        state.pathname = ''
        state.techUsersPathname = ''
      })
  }
})

export default appCategoriesSlice.reducer
