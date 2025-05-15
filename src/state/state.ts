import { configureStore } from '@reduxjs/toolkit';
import userArmiesReducer from './userArmiesSlice';
import musteringArmyReducer from './musteringArmySlice';

export const store = configureStore({
	reducer: { userArmies: userArmiesReducer, musteringArmy: musteringArmyReducer }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;