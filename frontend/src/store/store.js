import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'

// Ensure all injected endpoints are registered before store creation
import './api/userApi'
import './api/issueApi'
import './api/voteApi'
import './api/localBodyApi'
import './api/adminApi'
import './api/analyticsApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
})