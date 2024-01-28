import { configureStore } from '@reduxjs/toolkit';
import drawingsReducer from './drawingsSlice';

export const store = configureStore({
  reducer: {
    drawings: drawingsReducer,
  },
});
