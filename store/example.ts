import { createAction, createReducer } from '@reduxjs/toolkit';

// Interface
export interface IExample {
  exampleField: string;
}

// State
const initialState = [];

// Actions
export const setExample = createAction<IExample[]>('example/set');

// Reducer
export const example = createReducer<IExample[]>(initialState, (builder) => {
  builder.addCase(setExample, (state, action) => action.payload);
});
