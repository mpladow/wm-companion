import { UnitType } from '../data/army';
import { UnitDto } from '../schema/faction';
import { CharacterType, UnitDetailsType, UpgradeType } from './types';


// used for storage in memory
export type ArmyListPersistenceType = {
	versionNumber?: number;
	/**Unique ID */
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
	/**Unique ID */
	id: string;
	unitId: number;
	name: string;
	order: number;
	selectedUpgrades: UpgradePersistenceType[]
}

export type CharacterPersistenceType = {
	/**Unique ID */
	id: string;
	characterId: number;
	name: string;
	order: number;
	selectedUpgrades: UpgradePersistenceType[];
}


export type UpgradePersistenceType = {
	/**Unique ID */
	id: string;
	upgradeId: number;
	name: string;
}

