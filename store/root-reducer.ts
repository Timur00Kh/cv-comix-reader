import { combineReducers } from 'redux';
import { example } from '@/store/example';

export const rootReducer = combineReducers({ example });
export type RootState = ReturnType<typeof rootReducer>;
