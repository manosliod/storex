// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q?: string
  role?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  if (!!Object.keys(params).length) {
    if (params.hasOwnProperty('q') && !Object.keys(params.q!).length) {
      delete params.q
    }
    if (params.hasOwnProperty('role') && !Object.keys(params.role!).length) {
      delete params.role
    }
  }

  const response = await axios.get('/api/users', {
    params
  })

  const jsonObj = {
    users: response.data.data,
    total: response.data.results,
    params: params,
    allData: response.data
  }

  return jsonObj
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    let returnObj
    await axios
      .post('/api/users', {
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
            type: er.response.data.message.split('type:')[1],
            message: 'Value already in use!'
          }
        }
      })

    //@ts-ignore
    if (returnObj.error) return

    dispatch(fetchData(getState().user.params))

    return returnObj
  }
)

export const editUser = createAsyncThunk(
  'appUsers/editUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    let returnObj
    const id = data._id
    delete data._id
    await axios
      .patch(`/api/users/${id}`, {
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
            type: er.response.data.message.split('type:')[1],
            message: 'Value already in use!'
          }
        }
      })

    //@ts-ignore
    if (returnObj.error) return

    dispatch(fetchData(getState().user.params))

    return returnObj
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`/api/users/${id}`)

    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
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
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
