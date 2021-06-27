import { combineReducers } from 'redux';
import { example } from '@/store/example';
import { openCvReady } from '@/store/openCvReady';
import settings from '@/store/settings';

export const rootReducer = combineReducers({ example, openCvReady, settings });
export type RootState = ReturnType<typeof rootReducer>;
