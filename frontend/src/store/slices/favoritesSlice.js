import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    tracks: [],
    resources: []
  },
  reducers: {
    toggleFavorite(state, action) {
      const { item, itemType } = action.payload;
      const key = itemType === 'track' ? 'tracks' : 'resources';
      const exists = state[key].find((f) => f.id === item.id);
      if (exists) {
        state[key] = state[key].filter((f) => f.id !== item.id);
      } else {
        state[key].push(item);
      }
    },
    clearFavorites(state) {
      state.tracks = [];
      state.resources = [];
    }
  }
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
