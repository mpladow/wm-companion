import { Factions } from "./constants";
import genericSpecialRules from "../data/json/wmr/generic-special-rules/generic-special-rules.json";

import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";

export const getFactionsDropdown = () => {
	let ddFactionList = [];
	// for (const value in Factions) {
	// 	ddFactionList.push({ label: value?.replaceAll("_", " "), value: key } as DropDownItemProps);
	// }
	for (const [key, value] of Object.entries(Factions)) {
		isNaN(parseInt(key)) &&
			ddFactionList.push({ label: key.replaceAll("_", " "), value: value } as DropDownItemProps);
	}
	ddFactionList = ddFactionList.sort((a, b) => {
		if (a.label < b.label) {
			return -1;
		}
		if (a.label > b.label) {
			return 1;
		}
		return 0;
	});
	return { ddFactionList: ddFactionList };
};
export const getKeyByValue = (object: object, value: number) => {
	return Object.keys(object).find((key) => object[key] === value);
};
export const getGenericSpecialRules = () => {
	return genericSpecialRules;
};
export const getLocalFactionAssets = (faction: string) => {
	switch (faction) {
		case "Dark_Elves":
			return [require("../../assets/images/wm-darkElves.jpeg")];

		case "Bretonnia":
			return [require("../../assets/images/wm-bretonnian.jpg")];
		case "Orcs":
			return [require("../../assets/images/wm-orcs.jpg")];
		case "Tomb_Kings":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Empire":
			return [require("../../assets/images/wm-empire2.jpeg")];
		case "Skaven":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Chaos":
			return [require("../../assets/images/wm-chaos.jpeg")];
		case "Wood_Elves":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Vampire_Counts":
			return [require("../../assets/images/wm-vampcounts.jpeg")];
		case "Beastmen":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Cathay":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Goblins":
			return [require("../../assets/images/wm-goblins.jpg")];
		case "Dwarfs":
			return [require("../../assets/images/wm-dwarves.jpg")];
		case "High_Elves":
			return [require("../../assets/images/wm-highElves.jpg")];
		case "Daemons":
			return [require("../../assets/images/wm-daemons.jpg")];
		case "Nippon":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Chaos_Dwarfs":
			return [require("../../assets/images/wm-chaosDwarves2.jpeg")];

		case "Dogs_of_War":
			return [require("../../assets/images/wm-dogsOfWar2.png")];

		case "Araby":
			return [require("../../assets/images/wm-araby1.jpeg")];
		case "Lizardmen":
			return [require("../../assets/images/wm-lizardmen1.jpeg")];

		case "Albion":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Ogre_Kingdoms":
			return [require("../../assets/images/wm-ogres.jpg")];
		case "Kislev":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Norse":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Witch_Hunters":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		default:
			return [require("../../assets/images/wm-genericarmy-2.png")];
			break;
	}
};
