import { createAction, createReducer } from '@reduxjs/toolkit';
import { getLocalStorageJson } from '@/utils/getLocalStorageJson';

const localStorageName = 'hrum-settings';
export enum ReadOrder {
  rightToLeft,
  leftToRight
}

// Interface
export interface ISettings {
  readOrder: ReadOrder;
  showDebugHint: boolean;
}

// State
const initialState: ISettings = getLocalStorageJson(localStorageName) || {
  readOrder: ReadOrder.rightToLeft,
  showDebugHint: false
};

// Actions
export const setSettings = createAction<ISettings>('example/set');

// Reducer
const settings = createReducer<ISettings>(initialState, (builder) => {
  builder.addCase(setSettings, (state, action) => {
    const nextState = {
      ...state,
      ...action.payload
    };

    window.localStorage.setItem(localStorageName, JSON.stringify(nextState));

    return nextState;
  });
});

export default settings;
