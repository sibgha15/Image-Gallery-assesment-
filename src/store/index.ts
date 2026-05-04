import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import galleryReducer from './gallerySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
