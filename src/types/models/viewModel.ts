// models specific to certain pages. this may not be necessary

import { SpecialRulesType } from '../data/army';
import { UnitType } from '../schema/faction';
import { UpgradeType } from './types';

export type ArmyListVM = {
	versionNumber?: number;
	armyId: string;
	name: string;
	faction: string;
	isFavourite: boolean;
	armyNotes: string;
	order: number;
	selectedUnits: UnitDetailsVM[];
	selectedCharacters: CharacterVM[];
	points: number;
};

export type UnitDetailsVM = {
	id: string;
	unitId: number;
	name: string;
	order: number;
	type: UnitType;
	/**if string, it is a special rule */
	attack: number | string;
	hits: number;
	size: number;
	totalPoints: number;
	rangeAttack?: number | number[];
	range?: number;
	armour?: number;
	max?: number;
	min?: number;
	/**Unit cannot receive magic items */
	/** faction specific upgrades */
	selectedUpgrades: UpgradeVM[];
}

export type CharacterVM = {
	id: number;
	unitId: string;
	name: string;
	order: number;
	type: UnitType;
	attackBonus: number;
	command: number;
	size: number;
	points: number;
	armyMax: number;
	selectedUpgrades: UpgradeVM[];
}

export type UpgradeVM = {
	name: string;
	order: number
	type: UpgradeType,
	attackBonus?: number,
	points: number,
	max: number;
	/** changes the name of the original unit - this is only for units like Handgunners, who will replace the original unit's name if added. */
	replacesName?: boolean;
	/** this upgrade will replace the unit type of the attached unit - from Hero to Wizard */
	replacesType?: boolean;
}
