import { UnitProps } from "@utils/types";

export type ArmyReferenceType = {
	name: string;
	version: string;
	versionNumber?: number;
	group: number;
	order: number;
	description: string[];
	units: UnitProps[];
	upgrades?: any[];
	magic: boolean;
	armyRules?: string[];
	specialRules: any; // this needs to be changed into an array
};

export type UnitType = {
	name: string;
	oldName?: string;
	order: number;
	type: string;
	attack?: string | number; // characters can be undefined
	range?: string;
	hits?: number;
	armour?: "-" | "6+" | "5+" | "4+" | "3+" | "2+";
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
