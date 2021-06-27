import { combineReducers } from 'redux';
import { example } from '@/store/example';
import { openCvReady } from '@/store/openCvReady';
import settings from '@/store/settings';
import { comics } from '@/store/comics';

export const rootReducer = combineReducers({
  example,
  openCvReady,
  settings,
  comics
});
export type RootState = ReturnType<typeof rootReducer>;
