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

import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";

export const getFactions = () => {
	let ddFactionList = [];
	for (const [key, value] of Object.entries(Factions)) {
		ddFactionList.push({ label: key.replace("_", " "), value: value } as DropDownItemProps);
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
export const getKeyByValue = (object, value) => {
	return Object.keys(object).find((key) => object[key] === value);
};
export const getFactionUnits = (factionSelection: number) => {
	let list: any[] = [];
	let factionList;
	switch (factionSelection) {
		case Factions.Bretonnians:
			list = bretonnianList.units;
			factionList = bretonnianList;
			break;
		case Factions.Orcs:
			list = orcList.units;
			factionList = orcList;
			break;
		case Factions.Tomb_Kings:
			list = tombKingsList.units;
			factionList = tombKingsList;
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
		default:
			break;
	}
	const ddFactionUnits = list?.map((x) => ({
		label: `${x.name} - ${x.points}pts`,
		value: x.name ? x.name : "",
	}));
	return { ddFactionUnits: ddFactionUnits, factionList: factionList };
};
