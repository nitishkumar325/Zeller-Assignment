import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import customerReducer from './customerSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
  },
  middleware: getDefaultMiddleware =>
    __DEV__
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
