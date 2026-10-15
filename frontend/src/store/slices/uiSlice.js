import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showLogin: false,
  redirectAfterLogin: '/'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowLogin: (state, action) => {
      state.showLogin = action.payload
    },
    setRedirectAfterLogin: (state, action) => {
      state.redirectAfterLogin = action.payload
    }
  }
})

export const { setShowLogin, setRedirectAfterLogin } = uiSlice.actions
export default uiSlice.reducer