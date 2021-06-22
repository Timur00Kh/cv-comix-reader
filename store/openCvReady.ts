import { createAction, createReducer } from '@reduxjs/toolkit';

// Interface
export interface IOpenCvReady {
  openCvReady: boolean;
}

// State
const initialState: IOpenCvReady = {
  openCvReady: false
};

// Actions
export const setOpenCvReady = createAction<IOpenCvReady>('example/set');

// Reducer
export const openCvReady = createReducer<IOpenCvReady>(
  initialState,
  (builder) => {
    builder.addCase(setOpenCvReady, (state, action) => action.payload);
  }
);
