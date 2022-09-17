import { createAction, createReducer } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { getLocalStorageJson } from '@/utils/getLocalStorageJson';

// Interface
export interface Page {
  img: string;
  rects: cv.Rect[];
}

export interface IComics {
  id: string;
  title: string;
  pages: Page[];
  temp?: boolean;
}

const LOCAL_STORAGE_NAME = 'comics';

// State
const initialState = getLocalStorageJson(LOCAL_STORAGE_NAME) || [];

// Actions
export const addComics = createAction<IComics>('comics/set');

// Reducer
export const comics = createReducer<IComics[]>(initialState, (builder) => {
  builder.addCase(addComics, (state, action) => {
    const comicsState = [
      ...state,
      { ...action.payload, id: action.payload.id || nanoid() }
    ];

    window.localStorage.setItem(
      LOCAL_STORAGE_NAME,
      JSON.stringify(comicsState.filter((c) => !c.temp))
    );

    return comicsState;
  });
});
