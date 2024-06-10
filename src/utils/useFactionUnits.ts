import { ArmyReferenceType } from "src/types/data/army";
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

export const useFactionUnits = () => {
	const getFactionUnitsByVersion = (factionSelection: number, version?: number) => {
		let list: any[] = [];
		let factionList: ArmyReferenceType = {} as ArmyReferenceType;
		let description: string[] = [];
		switch (factionSelection) {
			case Factions.Bretonnians:
				list = bretonnianList.units;
				factionList = bretonnianList as ArmyReferenceType;
				description = bretonnianList.description;
				break;
			case Factions.Orcs:
				list = orcList.units;
				factionList = orcList as ArmyReferenceType;
				description = orcList.description;
				break;
			case Factions.Tomb_Kings:
				list = tombKingsList.units;
				factionList = tombKingsList as ArmyReferenceType;
				description = tombKingsList.description;
				break;
			case Factions.Empire:
				list = empireList.units;
				factionList = empireList as ArmyReferenceType;
				description = empireList.description;
				break;
			case Factions.Skaven:
				list = skavenList.units;
				factionList = skavenList as ArmyReferenceType;
				description = skavenList.description;

				break;
			case Factions.Chaos:
				list = chaosList.units;
				factionList = chaosList as ArmyReferenceType;
				description = chaosList.description;

				break;
			case Factions.Wood_Elves:
				list = woodElvesList.units;
				factionList = woodElvesList as ArmyReferenceType;
				description = woodElvesList.description;

				break;
			case Factions.Vampire_Counts:
				list = vampireCountsList.units;
				factionList = vampireCountsList as ArmyReferenceType;
				description = vampireCountsList.description;

				break;
			case Factions.Beastmen:
				list = beastmenList.units;
				factionList = beastmenList as ArmyReferenceType;
				description = beastmenList.description;

				break;
			case Factions.Cathay:
				list = cathayList.units;
				factionList = cathayList as ArmyReferenceType;
				description = cathayList.description;
				break;
			case Factions.Goblins:
				list = nightGoblinsList.units;
				factionList = nightGoblinsList as ArmyReferenceType;
				description = nightGoblinsList.description;

				break;
			case Factions.Dwarves:
				list = dwarvesList.units;
				factionList = dwarvesList as ArmyReferenceType;
				description = dwarvesList.description;

				break;
			case Factions.Dark_Elves:
				list = darkElvesList.units;
				factionList = darkElvesList as ArmyReferenceType;
				description = darkElvesList.description;

				break;
			case Factions.High_Elves:
				list = highElvesList.units;
				factionList = highElvesList as ArmyReferenceType;
				description = highElvesList.description;

				break;
			case Factions.Daemons:
				list = daemonsList.units;
				factionList = daemonsList as ArmyReferenceType;
				description = daemonsList.description;

				break;
			case Factions.Nippon:
				list = nipponList.units;
				factionList = nipponList as ArmyReferenceType;
				description = nipponList.description;

				break;
			case Factions.Chaos_Dwarves:
				list = chaosDwarvesList.units;
				factionList = chaosDwarvesList as ArmyReferenceType;
				description = chaosDwarvesList.description;

				break;
			case Factions.Dogs_Of_War:
				list = dogsOfWarList.units;
				factionList = dogsOfWarList as ArmyReferenceType;
				description = dogsOfWarList.description;

				break;
			case Factions.Araby:
				list = arabyList.units;
				factionList = arabyList as ArmyReferenceType;
				description = arabyList.description;

				break;
			case Factions.Lizardmen:
				list = lizardmenList.units;
				factionList = lizardmenList as ArmyReferenceType;
				description = lizardmenList.description;

				break;
			case Factions.Albion:
				list = albionList.units;
				factionList = albionList as ArmyReferenceType;
				description = albionList.description;

				break;
			case Factions.Ogres:
				list = ogresList.units;
				factionList = ogresList as ArmyReferenceType;
				description = ogresList.description;

				break;
			case Factions.Kislev:
				list = kislevList.units;
				factionList = kislevList as ArmyReferenceType;
				description = kislevList.description;

				break;
			case Factions.Norse:
				list = norseList.units;
				factionList = norseList as ArmyReferenceType;
				description = norseList.description;

				break;
			case Factions.Witch_Hunters:
				list = witchHunterList.units;
				factionList = witchHunterList as ArmyReferenceType;
				description = witchHunterList.description;

				break;
			default:
				break;
		}
		const ddFactionUnits = list?.map((x) => ({
			label: `${x.name} - ${x.points}pts`,
			value: x.name ? x.name : "",
		}));
		return { ddFactionUnits: ddFactionUnits, factionList: factionList, description: description };
	};

	return { getFactionUnitsByVersion };
};
