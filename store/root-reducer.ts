import { combineReducers } from 'redux';
import { example } from '@/store/example';
import { openCvReady } from '@/store/openCvReady';

export const rootReducer = combineReducers({ example, openCvReady });
export type RootState = ReturnType<typeof rootReducer>;
