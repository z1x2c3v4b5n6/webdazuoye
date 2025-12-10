import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statuses: {}
};

const resourceStatusSlice = createSlice({
  name: 'resourceStatus',
  initialState,
  reducers: {
    setStatus(state, action) {
      const { resourceId, status } = action.payload;
      state.statuses[resourceId] = status;
    },
    bulkSetStatus(state, action) {
      state.statuses = { ...state.statuses, ...action.payload };
    }
  }
});

export const { setStatus, bulkSetStatus } = resourceStatusSlice.actions;
export default resourceStatusSlice.reducer;
