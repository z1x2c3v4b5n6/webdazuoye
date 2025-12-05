import { createSlice } from '@reduxjs/toolkit';

const initialProgress = {
  items: {
    'track-basic-1': 40,
    'track-docker-1': 30,
    'track-k8s-1': 20
  },
  completedLessons: {}
};

const calculatePercent = (completedLessons = {}, totalLessons = 0) => {
  if (!totalLessons) return 0;
  const count = Object.values(completedLessons).filter(Boolean).length;
  return Math.min(100, Math.round((count / totalLessons) * 100));
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: initialProgress,
  reducers: {
    setProgress(state, action) {
      const { trackId, value } = action.payload;
      state.items[trackId] = value;
    },
    toggleLessonCompletion(state, action) {
      const { trackId, lessonId, totalLessons } = action.payload;
      if (!state.completedLessons[trackId]) {
        state.completedLessons[trackId] = {};
      }
      const current = !!state.completedLessons[trackId][lessonId];
      state.completedLessons[trackId][lessonId] = !current;
      state.items[trackId] = calculatePercent(state.completedLessons[trackId], totalLessons);
    }
  }
});

export const { setProgress, toggleLessonCompletion } = progressSlice.actions;
export default progressSlice.reducer;
