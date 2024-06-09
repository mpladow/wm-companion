import { Factions } from "./constants";
import bretonnianList from "../data/json/wmr/bretonnian.json";
import orcList from "../data/json/wmr/orks.json";
import tombKingsList from "../data/json/wmr/tombKings.json";
import empireList from "../data/json/wmr/empire.json";
import skavenList from "../data/json/wmr/skaven.json";
import chaosList from "../data/json/wmr/chaos.json";
import woodElvesList from "../data/json/wmr/woodElves.json";
import vampireCountsList from "../data/json/wmr/vampireCounts.json";
import beastmenList from "../data/json/wmr/beastmen.json";
import cathayList from "../data/json/wmr/cathay.json";
import nightGoblinsList from "../data/json/wmr/nightGoblins.json";
import dwarvesList from "../data/json/wmr/dwarves.json";
import darkElvesList from "../data/json/wmr/darkelves.json";
import highElvesList from "../data/json/wmr/highElves.json";
import daemonsList from "../data/json/wmr/daemons.json";
import nipponList from "../data/json/wmr/nippon.json";
import chaosDwarvesList from "../data/json/wmr/chaosDwarves.json";
import dogsOfWarList from "../data/json/wmr/dogsOfWar.json";
import arabyList from "../data/json/wmr/araby.json";
import lizardmenList from "../data/json/wmr/lizardmen.json";
import albionList from "../data/json/wmr/albion.json";
import ogresList from "../data/json/wmr/ogres.json";
import kislevList from "../data/json/wmr/kislev.json";
import norseList from "../data/json/wmr/norse.json";
import witchHunterList from "../data/json/wmr/witchHunters.json";

import genericSpecialRules from "../data/json/wmr/generic-special-rules/generic-special-rules.json";

import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { ArmyReferenceType } from "src/types/data/army";

export const getFactions = () => {
	let ddFactionList = [];
	// for (const value in Factions) {
	// 	ddFactionList.push({ label: value?.replaceAll("_", " "), value: key } as DropDownItemProps);
	// }
	for (const [key, value] of Object.entries(Factions)) {
		console.log(value, "value");
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

		case "Bretonnians":
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
		case "Dwarves":
			return [require("../../assets/images/wm-dwarves.jpg")];
		case "High_Elves":
			return [require("../../assets/images/wm-highElves.jpg")];
		case "Daemons":
			return [require("../../assets/images/wm-daemons.jpg")];
		case "Nippon":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Chaos_Dwarves":
			return [require("../../assets/images/wm-chaosDwarves2.jpeg")];

		case "Dogs_Of_War":
			return [require("../../assets/images/wm-dogsOfWar2.png")];

		case "Araby":
			return [require("../../assets/images/wm-araby1.jpeg")];
		case "Lizardmen":
			return [require("../../assets/images/wm-lizardmen1.jpeg")];

		case "Albion":
			return [require("../../assets/images/wm-genericarmy-2.png")];

		case "Ogres":
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

export const getFactionUnits = (factionSelection: number) => {
	let list: any[] = [];
	let factionList: ArmyReferenceType;
	let description: string[] = [];
	switch (factionSelection) {
		case Factions.Bretonnians:
			list = bretonnianList.units;
			factionList = bretonnianList;
			description = bretonnianList.description;
			break;
		case Factions.Orcs:
			list = orcList.units;
			factionList = orcList;
			break;
		case Factions.Tomb_Kings:
			list = tombKingsList.units;
			factionList = tombKingsList;
			description = bretonnianList.description;
			break;
		case Factions.Empire:
			list = empireList.units;
			factionList = empireList;
			break;
		case Factions.Skaven:
			list = skavenList.units;
			factionList = skavenList;
			break;
		case Factions.Chaos:
			list = chaosList.units;
			factionList = chaosList;
			break;
		case Factions.Wood_Elves:
			list = woodElvesList.units;
			factionList = woodElvesList;
			break;
		case Factions.Vampire_Counts:
			list = vampireCountsList.units;
			factionList = vampireCountsList;
			break;
		case Factions.Beastmen:
			list = beastmenList.units;
			factionList = beastmenList;
			break;
		case Factions.Cathay:
			list = cathayList.units;
			factionList = cathayList;
			description = cathayList.description;
			break;
		case Factions.Goblins:
			list = nightGoblinsList.units;
			factionList = nightGoblinsList;
			break;
		case Factions.Dwarves:
			list = dwarvesList.units;
			factionList = dwarvesList;
			break;
		case Factions.Dark_Elves:
			list = darkElvesList.units;
			factionList = darkElvesList;
			break;
		case Factions.High_Elves:
			list = highElvesList.units;
			factionList = highElvesList;
			break;
		case Factions.Daemons:
			list = daemonsList.units;
			factionList = daemonsList;
			break;
		case Factions.Nippon:
			list = nipponList.units;
			factionList = nipponList;
			break;
		case Factions.Chaos_Dwarves:
			list = chaosDwarvesList.units;
			factionList = chaosDwarvesList;
			break;
		case Factions.Dogs_Of_War:
			list = dogsOfWarList.units;
			factionList = dogsOfWarList;
			break;
		case Factions.Araby:
			list = arabyList.units;
			factionList = arabyList;
			break;
		case Factions.Lizardmen:
			list = lizardmenList.units;
			factionList = lizardmenList;
			break;
		case Factions.Albion:
			list = albionList.units;
			factionList = albionList;
			break;
		case Factions.Ogres:
			list = ogresList.units;
			factionList = ogresList;
			break;
		case Factions.Kislev:
			list = kislevList.units;
			factionList = kislevList;
			break;
		case Factions.Norse:
			list = norseList.units;
			factionList = norseList;
			break;
		case Factions.Witch_Hunters:
			list = witchHunterList.units;
			factionList = witchHunterList;
			break;
		default:
			break;
	}
	description = factionList?.description ? factionList?.description : [""];
	const ddFactionUnits = list?.map((x) => ({
		label: `${x.name} - ${x.points}pts`,
		value: x.name ? x.name : "",
	}));
	return { ddFactionUnits: ddFactionUnits, factionList: factionList, description: description };
};
