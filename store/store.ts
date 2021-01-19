import { useMemo } from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { rootReducer, RootState } from '@/store/root-reducer';

let currentStore;
const initialState = {};

function initStore(preloadedState = initialState): EnhancedStore {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production'
  });
}

export const initializeStore = (preloadedState: RootState): EnhancedStore => {
  let store = currentStore || initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && currentStore) {
    store = initStore({
      ...currentStore.getState(),
      ...preloadedState
    });

    // Reset the current store
    currentStore = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return store;

  // Create the store once in the client
  if (!currentStore) currentStore = store;

  return store;
};

export function useStore(state: RootState): EnhancedStore {
  const initializedStore = useMemo(() => initializeStore(state), [state]);
  return initializedStore;
}
