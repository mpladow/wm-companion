export type playerTypes = "playerOne" | "playerTwo";

export const margin = 4;
export const results = {
	Victory: "Victory",
	Defeat: "Defeat",
	Draw: "Draw",
};
export const Pages = {
	Settings: "Settings",
	Blunders: "Blunders",
	Monster: "Monster",
};

export enum UnitTypes {
	Infantry = "Infantry",
	Cavalry = "Cavalry",
	Chariot = "Chariot",
	Artillery = "Artillery",
	Monster = "Monster",
	General = "General",
	Hero="Hero",
	Wizard="Wizard",
	Machine="Machine"
}
export const Factions = {
	Bretonnians: 1,
	Orcs: 2,
	Tomb_Kings: 3,
	Empire: 4,
	Skaven: 5,
	Chaos: 6,
	Wood_Elves: 7,
	Vampire_Counts: 8,
	Beastmen: 9,
	Cathay: 10,
	Goblins: 11,
	Dwarves: 12,
	Dark_Elves: 13,
	High_Elves: 14,
	Daemons: 15,
	Nippon: 16,
	Chaos_Dwarves: 17,
};
export default playerTypes;
