// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
export const refreshData = createSlice({
  name: 'refreshData',
  initialState: {
    newWorking:false,
    newQuality:false,
    workingList:[],
    qualityList:[],
  },
  reducers: {
    workingActive: state=> {state.newWorking=!state.newWorking},
    workingPassive: state=> {state.newWorking=!state.newWorking},
    workingListUpdate: (state, action) => {
      state.workingList = action.payload
    },
    qualityRefresh: state=> {state.newQuality=!state.newQuality},
    qualityListUpdate: (state, action) => {
      state.qualityList = action.payload
    }
  }
})

export const {
  workingActive,workingPassive,workingListUpdate,qualityListUpdate,qualityRefresh
} = refreshData.actions

export default refreshData.reducer
