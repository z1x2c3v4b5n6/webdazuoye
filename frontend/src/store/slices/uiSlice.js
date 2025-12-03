import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
    recentViews: []
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    addRecentView(state, action) {
      const item = action.payload;
      state.recentViews = [item, ...state.recentViews.filter((v) => v.id !== item.id)].slice(0, 6);
    },
    clearRecent(state) {
      state.recentViews = [];
    }
  }
});

export const { toggleTheme, addRecentView, clearRecent } = uiSlice.actions;
export default uiSlice.reducer;
