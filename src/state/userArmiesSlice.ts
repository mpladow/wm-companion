import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserList } from 'src/types/modelsv2/persistence/userlist';

const initialState: UserList[] = []

// this handles the persistence feautres of the user's army lists. 
const userArmiesSlice = createSlice({
	name: 'userArmies',
	initialState: initialState,
	reducers: {
		addUserArmy: (state, action: PayloadAction<UserList>) => {
			state.push(action.payload);
		},
		updateUserArmy: (state, action: PayloadAction<UserList>) => {
			// todo: when saving, it should also update the unit cards
			const index = state.findIndex(x => x.UserListId == action.payload.UserListId);
			if (index !== -1) {
				state[index].Name = action.payload.Name;
				state[index].UnitCards = action.payload.UnitCards;
				state[index].IsFavourite = action.payload.IsFavourite;
				state[index].Notes = action.payload.Notes;
				state[index].VersionNumber = action.payload.VersionNumber;
				state[index].CustomImageUrl = action.payload.CustomImageUrl;
				state[index].FactionId = action.payload.FactionId;
			}
		},
		deleteUserArmy: (state, action: PayloadAction<string>) => {
			state = state.filter(x => x.UserListId == action.payload);
		}
	}
})

export const { updateUserArmy, addUserArmy, deleteUserArmy } = userArmiesSlice.actions;
export default userArmiesSlice.reducer;