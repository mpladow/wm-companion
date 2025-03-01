import { UnitType } from '../data/army';
import { UnitDto } from '../schema/faction';
import { CharacterType, UnitDetailsType, UpgradeType } from './types';


// used for storage in memory
export type ArmyListPersistenceType = {
	versionNumber?: number;
	armyId: string;
	faction: number;
	name: string;
	isFavourite: boolean;
	armyNotes: string;
	order: number;
	selectedUnits: UnitPersistenceType[];
	selectedCharacters: CharacterPersistenceType[];
	points: number;
};

export type UnitPersistenceType = {
	id: number;
	name: string;
	min?: number;
	armyMin?: number;
	armyMax?: number;
	max?: number;
	selectedUpgrades: UpgradePersistenceType[]
	points: number;
}

export type CharacterPersistenceType = {
	id: number;
	name: string;
	upgrades?: string[]; // ids of upgrades per character
	armyMin?: number;
	permittedUpgrades?: string[]
	selectedUpgrades: UpgradePersistenceType[];
	points: number;
}


export type UpgradePersistenceType = {
	id: number;
	name: string;
	max?: number;
	points: number;
}

