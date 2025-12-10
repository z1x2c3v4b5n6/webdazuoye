import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';
import planReducer from './slices/planSlice';
import resourceStatusReducer from './slices/resourceStatusSlice';

const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const serialized = localStorage.getItem('cloud-learning-state');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify({
      favorites: state.favorites,
      progress: state.progress,
      ui: state.ui,
      plan: state.plan,
      resourceStatus: state.resourceStatus
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
    ui: uiReducer,
    plan: planReducer,
    resourceStatus: resourceStatusReducer
  },
  preloadedState: loadState()
});

store.subscribe(() => saveState(store.getState()));

export default store;
