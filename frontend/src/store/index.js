import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';

const loadState = () => {
  try {
    const serialized = localStorage.getItem('cloud-learning-state');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serialized = JSON.stringify({
      favorites: state.favorites,
      progress: state.progress,
      ui: state.ui
    });
    localStorage.setItem('cloud-learning-state', serialized);
  } catch (e) {
    // ignore
  }
};

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    progress: progressReducer,
    ui: uiReducer
  },
  preloadedState: typeof window !== 'undefined' ? loadState() : undefined
});

store.subscribe(() => saveState(store.getState()));

export default store;
