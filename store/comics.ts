import { createAction, createReducer } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

// Interface
export interface Page {
  img: string;
  rects: cv.Rect[];
}

export interface IComics {
  id: string;
  title: string;
  pages: Page[];
}

// State
const initialState = [];

// Actions
export const addComics = createAction<IComics>('example/set');

// Reducer
export const comics = createReducer<IComics[]>(initialState, (builder) => {
  builder.addCase(addComics, (state, action) => [
    ...state,
    { ...action.payload, id: action.payload.id || nanoid() }
  ]);
});
