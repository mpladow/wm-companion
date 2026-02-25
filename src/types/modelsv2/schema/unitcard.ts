import type { UnitCardTypeSchema } from './cardtype';

export interface UnitCardSchema {
	id: number;
	name: string;
	description?: string;
	order: number;
	unitCardType: UnitCardTypeSchema;
	armyMin?: number;
	armyMax?: number;
	min?: number;
	max?: number;
	size: number;
	points: number;
	// SpecialRules: SpecialRuleSchema[]
	permittedUpgrades?: string[];
	/**Determines whether upgrades can be permitted for this unit card */
	preventUpgrades: boolean;
	ignoreFromBreakpoint?: boolean;

}

export interface CharacterCardSchema extends UnitCardSchema {
	attackBonus?: number;
	command?: number;
}

export interface TroopCardSchema extends UnitCardSchema {
	attack?: number;
	/** there could be multiple values, eg cannons. Generally there will only be one value */
	rangedAttack?: number[]
	range?: number;
	hits: number;
	armour?: number;
}