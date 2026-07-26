import { useRulesetContext } from '@context/RulesetContext';
import { defaultRulesetId, getRulesetData, RulesetId } from 'src/data/rulesets';
import { ArmyReferenceType, RegimentOfRenownUnitReferenceType } from "src/types/data/army";
import { Factions } from "./constants";

export const useFactionUnits = () => {
	const { selectedRulesetId } = useRulesetContext();

	const getRegimentsOfRenownUnitsForFaction = (
		factionSelection?: number,
		getLeaders?: boolean,
		rulesetId: RulesetId = selectedRulesetId,
	) => {
		const regimentsOfRenownPermittedList: RegimentOfRenownUnitReferenceType[] = [];
		const { regimentsOfRenown } = getRulesetData(rulesetId);

		const regimentsOfRenownList = regimentsOfRenown.find((a => a.name == "Regiments_of_Renown"));
		if (regimentsOfRenownList) {
			if (factionSelection == undefined) {
				return getLeaders ? regimentsOfRenownList.units.filter(x => (x.command !== undefined) == getLeaders) : regimentsOfRenownList.units;
			}
			// iterate over all units and check the forbiddenFactions array and ensure this factionSelection is not included.
			if (getLeaders !== undefined) {
				regimentsOfRenownList.units.filter(x => (x.command !== undefined) == getLeaders).forEach((item, index) => {
					const unitIsForbiddenFromFaction = item.forbiddenFactions?.includes(Factions[factionSelection])
					if (!unitIsForbiddenFromFaction) {
						regimentsOfRenownPermittedList.push(item);
					}
				})
			} else {
				regimentsOfRenownList.units.forEach((item, index) => {
					const unitIsForbiddenFromFaction = item.forbiddenFactions?.includes(Factions[factionSelection])
					if (!unitIsForbiddenFromFaction) {
						regimentsOfRenownPermittedList.push(item);
					}
				})

			}
		}
		return regimentsOfRenownPermittedList;
	}

	const getRegimentsOfRenownFactionData = () => {
		const { regimentsOfRenown } = getRulesetData(selectedRulesetId);
		return regimentsOfRenown.find((a => a.name == "Regiments_of_Renown"));

	}
	const getFactionUnitsByVersion = (
		factionSelection?: number,
		version?: number,
		rulesetId: RulesetId = selectedRulesetId,
	) => {
		let list: any[] = [];
		let factionList: ArmyReferenceType = {} as ArmyReferenceType;
		let description: string[] = [];
		if (factionSelection == undefined) {
			return { ddFactionUnits: [], factionList: factionList, description: description };
		}
		const army = Factions[factionSelection]?.replaceAll("_", " ");
		const { armiesV2, legacyArmies } = getRulesetData(rulesetId);

		if (version == undefined || version >= 2.24) {
			const _factionList = armiesV2.find((x) => x.name == army);
			if (_factionList) {
				factionList = _factionList;
				list = factionList?.units;
				// factionList = factionList;
				description = factionList.description;
			}
		}
		else {
			// old army versions
			const legacyFactionList =
				legacyArmies[factionSelection as Factions] ??
				getRulesetData(defaultRulesetId).legacyArmies[factionSelection as Factions];
			if (legacyFactionList) {
				list = legacyFactionList.units;
				factionList = legacyFactionList as ArmyReferenceType;
				description = legacyFactionList.description;
			}
		}
		const ddFactionUnits = list?.map((x) => ({
			label: `${x.name} - ${x.points}pts`,
			value: x.name ? x.name : "",
		}));
		return { ddFactionUnits: ddFactionUnits, factionList: factionList, description: description };
	};
	const getGenericSpecialRules = (rulesetId: RulesetId = selectedRulesetId) => {
		return getRulesetData(rulesetId).genericSpecialRules;
	};

	const getMagicItemsList = (rulesetId: RulesetId = selectedRulesetId) => {
		return getRulesetData(rulesetId).magicItems;
	};

	return { getFactionUnitsByVersion, getGenericSpecialRules, getMagicItemsList, getRegimentsOfRenownForFaction: getRegimentsOfRenownUnitsForFaction, getRegimentsOfRenownFactionData };
};
