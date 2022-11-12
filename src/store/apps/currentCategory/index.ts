// ** Redux Imports
import { Dispatch } from 'redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { NextRouter } from 'next/router'

interface data {
  id: any
  storeId: any
  role?: any
}

export const fetchURLForCategory = createAsyncThunk('appCurrentCategory/fetchURLForCategory', (data: data) => {
  return {
    pathname: `/api/stores/${data.storeId}/category/${data.id}`,
    techUsersPathname:
      data.role === 'salesman' || data.role === 'accountant' || data.role === 'user'
        ? ''
        : `/api/users/store/${data.storeId}?role=tech`
  }
})

export const fetchCategoryRole = createAsyncThunk('appCurrentCategory/fetchCategoryRole', (data: any) => {
  return {
    role: data
  }
})

export const fetchCategoryData = createAsyncThunk(
  'appCurrentCategory/fetchCategoryData',
  async (id: string | null | number, { getState, rejectWithValue }) => {
    let error = {}
    try {
      const { currentCategory }: any = getState()
      const res = await axios.get(currentCategory.pathname)

      let response_2
      if (currentCategory.techUsersPathname !== '') response_2 = await axios.get(currentCategory.techUsersPathname)

      return {
        techUsers: response_2 ? response_2.data.data : '',
        category: res.data.doc,
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

export const editCategory = createAsyncThunk(
  'appCurrentCategory/editCategory',
  async (data: { [key: string]: number | string }, { getState, rejectWithValue }) => {
    const id = data._id
    delete data._id
    let error = {}
    try {
      const { currentCategory }: any = getState()
      const res = await axios.patch(currentCategory.pathname, {
        ...data
      })
      const response_2 = await axios.get(currentCategory.techUsersPathname)

      return {
        techUsers: response_2.data.data,
        category: res.data.doc,
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

// ** Delete Category
export const deleteCategory = createAsyncThunk(
  'appCurrentCategory/deleteCategory',
  async (id: number | string, { getState, dispatch, rejectWithValue }) => {
    let error = {}
    try {
      const { currentCategory }: any = getState()
      const res = await axios.delete(currentCategory.pathname)

      return {
        category: res.data.doc,
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

export const appCurrentCategorySlice = createSlice({
  name: 'appCurrentCategory',
  initialState: {
    pathname: '',
    techUsersPathname: '',
    techUsers: [],
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
      .addCase(fetchCategoryData.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.category
        state.techUsers = action.payload.techUsers
        state.allData = action.payload.allData
      })
      .addCase(fetchCategoryData.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(editCategory.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.data = action.payload.category
        state.techUsers = action.payload.techUsers
        state.allData = action.payload.allData
        state.error = {
          statusCode: 200
        }
      })
      .addCase(editCategory.rejected, (state, action: PayloadAction<{} | any>) => {
        state.error = action.payload.error
      })
      .addCase(fetchURLForCategory.fulfilled, (state, action: PayloadAction<{} | any>) => {
        state.pathname = action.payload.pathname
        state.techUsersPathname = action.payload.techUsersPathname
      })
      .addCase(fetchURLForCategory.rejected, (state, action: PayloadAction<{} | any>) => {
        state.pathname = ''
        state.techUsersPathname = ''
      })
  }
})

export default appCurrentCategorySlice.reducer
