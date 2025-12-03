import { createSlice } from '@reduxjs/toolkit';

const initialProgress = {
  items: {
    'track-basic-1': 40,
    'track-docker-1': 30,
    'track-k8s-1': 20
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: initialProgress,
  reducers: {
    setProgress(state, action) {
      const { trackId, value } = action.payload;
      state.items[trackId] = value;
    }
  }
});

export const { setProgress } = progressSlice.actions;
export default progressSlice.reducer;
