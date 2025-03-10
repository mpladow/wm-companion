import { NumberArray } from 'react-native-svg';
import { FactionSpecialRules } from './specialRules';

export type FactionDto = {
	name: string;
	id?: number;
	version: string;
	group: number,
	order: number,
	description: string[],
	units: UnitDto[];
	characters: Character[];
	/**faction uses magic */
	magic: boolean;
	factionSpecialRules?: FactionSpecialRules[];
	spells: Spell[]
}

export type UnitDto = {
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
	/**general upgrades for unit */
	upgrades?: string[];
	/** faction specific upgrades */
	factionUpgrades?: string[];
	armyMin?: number;
	armyMax?: number;
	/** this unit can only be attached to an existing unit. it takes the armour value for the rest of the uni, either 6+ or 0. This also adds to the unit size. e.g. Skirmishers */
	attachTo?: string[]
	/** this unit never counts as a casualty for purposes of issuing orders. */
	noCount?: boolean;
	/**List of units that need to be in the army in order to take this unit */
	requiredUnits?: string[]

}

export type Character = {
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
	factionUpgrades?: string[]
}

export type Upgrade = {
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

export type Spell = {
	name: string;
	roll: number,
	range?: number,
	description: string[]
}

export type UnitType = "Infantry" | "Cavalry" | "Artillery" | "Machine" | "General" | "Hero" | "Wizard"
export type UpgradeType = "Monstrous Mount" | "Chariot Mount" | "Special"