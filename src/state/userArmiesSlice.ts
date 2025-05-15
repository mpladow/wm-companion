import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArmyListPersistenceType } from 'src/types/models/persistence';

const initialState: ArmyListPersistenceType[] = []

const userArmiesSlice = createSlice({
	name: 'userArmies',
	initialState: initialState,
	reducers: {
		addUserArmy: (state, action: PayloadAction<ArmyListPersistenceType>) => {
			state.push(action.payload);
		},
		updateUserArmy: (state, action: PayloadAction<ArmyListPersistenceType>) => {
			const index = state.findIndex(x => x.armyId == action.payload.armyId);
			if (index) {
				state[index].name = action.payload.name;
				state[index].selectedCharacters = action.payload.selectedCharacters;
				state[index].selectedUnits = action.payload.selectedUnits;

			}
		},
		deleteUserArmy: (state, action: PayloadAction<string>) => {
			state = state.filter(x => x.armyId == action.payload);

		}
	}
})

export const { updateUserArmy, addUserArmy, deleteUserArmy } = userArmiesSlice.actions;
export default userArmiesSlice.reducer;