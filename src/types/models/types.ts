import { SpecialRulesType } from '../data/army';
import { UnitType } from '../schema/faction';

// these are the types that contain the fully hydrated object from the schema. It combines all the relationships into a single entity 

export type FactionType = {
	name: string;
	version: string;
	order: number,
	description: string[],
	units: UnitDetailsType[];
	characters: CharacterType[];
	allSpecialRules: AllSpecialRulesType[];
	spells: SpellDto[];
	/**faction uses magic */
	magic: boolean;
	isCustom?: boolean
}

export type ArmyListType = {
	versionNumber?: number;
	armyId: string;
	faction: number;
	name: string;
	isFavourite: boolean;
	armyNotes: string;
	order: number;
	selectedUnits: UnitDetailsType[];
	selectedCharacters: CharacterType[];
	points: number;
};


export type UnitDetailsType = {
	id: number;
	name: string;
	order: number;
	type: UnitType;
	attack: number;
	hits: number;
	size: number;
	points: number;
	max?: number;
	rangeAttack?: number | number[];
	range?: number;
	armour?: number;
	min?: number;
	/**Unit cannot receive magic items */
	noMagic?: boolean
	/** faction specific upgrades */
	permittedUpgrades?: UpgradeType[];
	armyMax?: number;
	/** this unit can only be attached to an existing unit. it takes the armour value for the rest of the uni, either 6+ or 0. This also adds to the unit size. e.g. Skirmishers */
	attachedTo?: string[]
	/** this unit never counts as a casualty for purposes of issuing orders. */
	noCount?: boolean;
	// all special rules for this unit
	specialRules?: SpecialRulesType[]
}

export type CharacterType = {
	id: number;
	name: string;
	order: number;
	type: UnitType;
	attackBonus: number;
	command: number;
	size: number;
	points: number;
	armyMax: number;
	upgrades?: string[];
	armyMin?: number;
	permittedUpgrades?: string[]
}

export type UpgradeType = {
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

export type AllSpecialRulesType = {
	id: string,
	name: string;
	order: number,
	description: string[]
}

export type SpellDto = {
	name: string;
	roll: number,
	range?: number,
	description: string[]
}