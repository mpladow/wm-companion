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
};

export type UnitPersistenceType = {
	id: string;
	unitId: number | string;
	name: string;
	selectedUpgrades: UpgradePersistenceType[]
}

export type CharacterPersistenceType = {
	id: string;
	characterId: number | string;
	name: string;
	selectedUpgrades: UpgradePersistenceType[];
}


export type UpgradePersistenceType = {
	id: string;
	upgradeId: number;
	name: string;
}

