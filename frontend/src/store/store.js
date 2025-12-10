import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import progressReducer from './slices/progressSlice';
import uiReducer, { initialUiState } from './slices/uiSlice';
import planReducer from './slices/planSlice';
import resourceStatusReducer from './slices/resourceStatusSlice';

const getDefaultState = () => ({
  favorites: favoritesReducer(undefined, { type: '@@INIT' }),
  progress: progressReducer(undefined, { type: '@@INIT' }),
  ui: initialUiState,
  plan: planReducer(undefined, { type: '@@INIT' }),
  resourceStatus: resourceStatusReducer(undefined, { type: '@@INIT' })
});

const defaultState = getDefaultState();

const loadState = () => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const serialized = localStorage.getItem('cloud-learning-state');
    if (!serialized) return defaultState;
    const saved = JSON.parse(serialized) || {};
    const savedUi = saved.ui || {};
    const mergedUi = {
      ...defaultState.ui,
      ...savedUi,
      milestonesSeen: { ...defaultState.ui.milestonesSeen, ...(savedUi.milestonesSeen || {}) },
      recentSearches: { ...defaultState.ui.recentSearches, ...(savedUi.recentSearches || {}) }
    };
    return {
      ...defaultState,
      ...saved,
      ui: mergedUi
    };
  } catch (e) {
    return defaultState;
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
