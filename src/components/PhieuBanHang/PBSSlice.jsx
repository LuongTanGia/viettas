/** @format */

import { createSlice } from '@reduxjs/toolkit'

// eslint-disable-next-line react-refresh/only-export-components
export default createSlice({
  name: 'phieuBanHang',
  initialState: {
    data: [],
    data_chitiet: [],
  },
  reducers: {
    getDanhSach: (state, action) => {
      state.data = action.payload
    },
    data_chitiet: (state, action) => {
      state.data_chitiet = action.payload
    },
  },
})
