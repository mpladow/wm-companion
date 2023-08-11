export type ResultProps = {
	result: Victory | Draw | Defeat;
	diff: number;
};

export type GenericObject = { [key: string]: any };

// types to manage json files
export type FactionListProps = {
	name?: string;
	id?: number;
	version?: string;
	group?: number;
	order?: number;
	units?: any[];
	upgrades?: UpgradesProps[];
	magic?: boolean;
	armyRules?: string[];
	specialRules?: Object;
	spells?: SpellsProps[];
};
export type UpgradesProps = {
	name: string;
	order?: number | string;
	type?: string;
	attack?: string | number;
	points: string | number | GenericObject;
	max?: number; // when item exists in army list
	armyMax?: number; // generic item
	pointsValue?: string | undefined;
	text: string[];
};
export type SpellsProps = {
	name?: string;
	roll?: number;
	range?: string;
	text?: string[];
};
export type UnitProps = {
	name: string;
	order: number;
	type: string;
	armour?: string;
	command?: number;
	attack?: number | string;
	hits?: number | string;
	size?: number | string;
	points: number;
	min?: number;
	max?: number;
	range: string;
	armyMax?: number;
	armyMin?: number;
	upgrades?: string[];
	specialRules?: string[];
	noMagic?: boolean;
	noCount?:boolean;
};
