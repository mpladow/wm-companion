import { UnitProps } from "@utils/types";

export type GenericArmyReferenceType = {
	name: string;
	version: string;
	versionNumber?: number;
	group: number;
	order: number;
	description: string[];
	magic: boolean;

}
export type ArmyReferenceType = {
	units: UnitProps[];
	upgrades?: any[];
	armyRules?: string[];
	specialRules: any; // this needs to be changed into an array
} & GenericArmyReferenceType;

export type RegimentOfRenownArmyReferenceType = {
	units: RegimentOfRenownUnitReferenceType[];
	upgrades?: any[];
	specialRules: any; // this needs to be changed into an array
} & GenericArmyReferenceType

export type RegimentOfRenownUnitReferenceType = {
	quoteOne: string;
	quoteOneAuthor: string;
	description: string[];
	forbiddenFactions: string[];
	forbiddenRoRUnits: string[];
	replacesUnit: ReplacesUnit[]
	replacesType: string[];
	countsAsMonster: string[] // this will usually be for tomb king armies
	specialRules: any; // this needs to be changed into an array
} & UnitType

export type ReplacesUnit = {
	type: string,
	name: string,
	faction: string
}
export type ArmourType = "-" | "6+" | "5+" | "4+" | "3+" | "2+"
export type UnitType = {
	name: string;
	oldName?: string;
	order: number;
	type: string;
	attack?: string | number; // characters can be undefined
	range?: string;
	hits?: number;
	armour?: string;
	size: number | string;
	points: number;
	noCount?: boolean;
	command?: number;
	min?: number | undefined;
	max?: number | undefined;
	armyMin?: number;
	armyMax?: number;
	specialRules?: string[];
	noMagic?: boolean;
	upgrades?: any[];
	augendUnits?: string[];
};

export type UpgradeType = {
	name: string;
	order: number;
	type: string;
	attack: string;
	points: string; //look into changing this to a number
	max: number;
};

export type SpecialRulesType = {
	name: string;
	text: string[];
};
