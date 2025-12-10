import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
    recentViews: [],
    milestonesSeen: {
      cloud: [],
      docker: [],
      k8s: []
    },
    recentSearches: {
      tracks: [],
      resources: []
    }
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
    addRecentSearch(state, action) {
      const { page, keyword } = action.payload;
      if (!keyword) return;
      const key = page === 'resources' ? 'resources' : 'tracks';
      const list = state.recentSearches[key] || [];
      state.recentSearches[key] = [keyword, ...list.filter((k) => k !== keyword)].slice(0, 5);
    },
    clearRecent(state) {
      state.recentViews = [];
      state.recentSearches = { tracks: [], resources: [] };
    },
    markMilestoneSeen(state, action) {
      const { stage, milestone } = action.payload;
      if (!stage || milestone == null) return;
      const list = state.milestonesSeen[stage] || [];
      if (!list.includes(milestone)) {
        state.milestonesSeen[stage] = [...list, milestone];
      }
    }
  }
});

export const { toggleTheme, addRecentView, clearRecent, markMilestoneSeen, addRecentSearch } = uiSlice.actions;
export default uiSlice.reducer;
