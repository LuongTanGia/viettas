import { configureStore } from '@reduxjs/toolkit'
import LoginSlice from '../components/Auth/loginSlice'
import MainSlice from '../components/MainPage/MainSlice'

import PBSSlice from '../components/PhieuBanHang/PBSSlice'

const store = configureStore({
  reducer: {
    AuthData: LoginSlice.reducer,
    mainData: MainSlice.reducer,
    phieuBanHang: PBSSlice.reducer,
  },
})

export default store
