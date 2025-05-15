import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArmyListType } from 'src/types/models/types';

const initialState: ArmyListType = {
	armyId: '',
	faction: 0,
	name: '',
	isFavourite: false,
	armyNotes: '',
	order: 0,
	selectedUnits: [],
	selectedCharacters: [],
	points: 0
}

const musteringArmySlice = createSlice({
	name: 'musteringArmy',
	initialState: initialState,
	reducers: {
		setArmyToEdit: (state, { payload }: PayloadAction<ArmyListType>) => {
			console.log("🚀 ~ handlePrimaryButtonPress payload:", payload)
			return payload
		},
		addUnit: (state, action: PayloadAction<number | string>) => {

		},
		deleteUnit: (state, action: PayloadAction<number | string>) => {

		},
		addCharacter: (state, action: PayloadAction<number | string>) => {

		},
		deleteCharacter: (state, action: PayloadAction<number | string>) => { },
		addUpgrade: (state, action: PayloadAction<number | string>) => {

		},
		deleteUpgrade: (state, action: PayloadAction<number | string>) => { }

	}
})

export const { setArmyToEdit, addUnit, deleteUnit, addCharacter, deleteCharacter, addUpgrade, deleteUpgrade } = musteringArmySlice.actions;

export default musteringArmySlice.reducer;