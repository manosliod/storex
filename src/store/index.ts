// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import currentUser from 'src/store/apps/currentUser'
import stores from 'src/store/apps/stores'

export const store = configureStore({
  reducer: {
    user,
    currentUser,
    stores
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
