import { Factions } from '@utils/constants';
import { WmaFactions } from '@utils/wmaConstants';
import { ArmyReferenceType, RegimentOfRenownArmyReferenceType } from 'src/types/data/army';
import wmaGenericSpecialRules from './json/wma/generic-special-rules/generic-special-rules.json';
import wmaMagicItemsList from './json/wma/magic-items.json';
import achaemenidPersianList from './json/wma/achaemenid-persian.json';
import greekList from './json/wma/greek.json';
import {
  wmaArmiesV2,
  wmaRegimentsOfReknownListV1,
} from './json/wma/_armies';

import wmrAlbionList from './json/wmr/albion.json';
import wmrArabyList from './json/wmr/araby.json';
import wmrBeastmenList from './json/wmr/beastmen.json';
import wmrBretonnianList from './json/wmr/bretonnian.json';
import wmrCathayList from './json/wmr/cathay.json';
import wmrChaosList from './json/wmr/chaos.json';
import wmrChaosDwarvesList from './json/wmr/chaosDwarves.json';
import wmrDaemonsList from './json/wmr/daemons.json';
import wmrDarkElvesList from './json/wmr/darkelves.json';
import wmrDogsOfWarList from './json/wmr/dogsOfWar.json';
import wmrDwarvesList from './json/wmr/dwarves.json';
import wmrEmpireList from './json/wmr/empire.json';
import wmrGenericSpecialRules from './json/wmr/generic-special-rules/generic-special-rules.json';
import wmrHighElvesList from './json/wmr/highElves.json';
import wmrKislevList from './json/wmr/kislev.json';
import wmrLizardmenList from './json/wmr/lizardmen.json';
import wmrMagicItemsList from './json/wmr/magic-items.json';
import wmrNightGoblinsList from './json/wmr/nightGoblins.json';
import wmrNipponList from './json/wmr/nippon.json';
import wmrNorseList from './json/wmr/norse.json';
import wmrOgresList from './json/wmr/ogres.json';
import wmrOrcList from './json/wmr/orks.json';
import wmrSkavenList from './json/wmr/skaven.json';
import wmrTombKingsList from './json/wmr/tombKings.json';
import {
	wmrArmiesV2,
	regimentsOfReknownListV1 as wmrRegimentsOfReknownListV1,
} from './json/wmr/v2/_armies';
import wmrVampireCountsList from './json/wmr/vampireCounts.json';
import wmrWitchHunterList from './json/wmr/witchHunters.json';
import wmrWoodElvesList from './json/wmr/woodElves.json';

export const RULESET_STORAGE_KEY = 'selectedRuleset';

export const rulesetIds = {
  warmasterRevolution: 'warmaster-revolution',
  warmasterAncients: 'warmaster-ancients',
} as const;

export type RulesetId = (typeof rulesetIds)[keyof typeof rulesetIds];

export type RulesetDefinition = {
  id: RulesetId;
  label: string;
};

export const rulesets: RulesetDefinition[] = [
  { id: rulesetIds.warmasterRevolution, label: 'Warmaster Revolution' },
  { id: rulesetIds.warmasterAncients, label: 'Warmaster Ancients' },
];

export const defaultRulesetId = rulesetIds.warmasterRevolution;

export const isRulesetId = (value: string | undefined): value is RulesetId => {
  return rulesets.some((ruleset) => ruleset.id === value);
};

export const getRulesetLabel = (rulesetId: RulesetId = defaultRulesetId) => {
  return rulesets.find((ruleset) => ruleset.id === rulesetId)?.label ?? rulesets[0].label;
};

type RulesetData = {
  armiesV2: ArmyReferenceType[];
  regimentsOfRenown: RegimentOfRenownArmyReferenceType[];
  legacyArmies: Partial<Record<number, ArmyReferenceType>>;
  magicItems: any;
  genericSpecialRules: any;
};

const wmrLegacyArmies: Partial<Record<number, ArmyReferenceType>> = {
  [Factions.Bretonnia]: wmrBretonnianList as ArmyReferenceType,
  [Factions.Orcs]: wmrOrcList as ArmyReferenceType,
  [Factions.Tomb_Kings]: wmrTombKingsList as ArmyReferenceType,
  [Factions.Empire]: wmrEmpireList as ArmyReferenceType,
  [Factions.Skaven]: wmrSkavenList as ArmyReferenceType,
  [Factions.Chaos]: wmrChaosList as ArmyReferenceType,
  [Factions.Wood_Elves]: wmrWoodElvesList as ArmyReferenceType,
  [Factions.Vampire_Counts]: wmrVampireCountsList as ArmyReferenceType,
  [Factions.Beastmen]: wmrBeastmenList as ArmyReferenceType,
  [Factions.Cathay]: wmrCathayList as ArmyReferenceType,
  [Factions.Goblins]: wmrNightGoblinsList as ArmyReferenceType,
  [Factions.Dwarfs]: wmrDwarvesList as ArmyReferenceType,
  [Factions.Dark_Elves]: wmrDarkElvesList as ArmyReferenceType,
  [Factions.High_Elves]: wmrHighElvesList as ArmyReferenceType,
  [Factions.Daemons]: wmrDaemonsList as ArmyReferenceType,
  [Factions.Nippon]: wmrNipponList as ArmyReferenceType,
  [Factions.Chaos_Dwarfs]: wmrChaosDwarvesList as ArmyReferenceType,
  [Factions.Dogs_of_War]: wmrDogsOfWarList as ArmyReferenceType,
  [Factions.Araby]: wmrArabyList as ArmyReferenceType,
  [Factions.Lizardmen]: wmrLizardmenList as ArmyReferenceType,
  [Factions.Albion]: wmrAlbionList as ArmyReferenceType,
  [Factions.Ogre_Kingdoms]: wmrOgresList as ArmyReferenceType,
  [Factions.Kislev]: wmrKislevList as ArmyReferenceType,
  [Factions.Norse]: wmrNorseList as ArmyReferenceType,
  [Factions.Witch_Hunters]: wmrWitchHunterList as ArmyReferenceType,
};

const wmaLegacyArmies: Partial<Record<number, ArmyReferenceType>> = {
  [WmaFactions.Greek]: greekList as ArmyReferenceType,
  [WmaFactions.Achaemenid_Persian]: achaemenidPersianList as ArmyReferenceType,
};

const rulesetData: Record<RulesetId, RulesetData> = {
  [rulesetIds.warmasterRevolution]: {
    armiesV2: wmrArmiesV2,
    regimentsOfRenown: wmrRegimentsOfReknownListV1,
    legacyArmies: wmrLegacyArmies,
    magicItems: wmrMagicItemsList,
    genericSpecialRules: wmrGenericSpecialRules,
  },
  [rulesetIds.warmasterAncients]: {
    armiesV2: wmaArmiesV2,
    regimentsOfRenown: wmaRegimentsOfReknownListV1,
    legacyArmies: wmaLegacyArmies,
    magicItems: wmaMagicItemsList,
    genericSpecialRules: wmaGenericSpecialRules,
  },
};

export const getRulesetData = (rulesetId: RulesetId = defaultRulesetId) => {
  return rulesetData[rulesetId] ?? rulesetData[defaultRulesetId];
};

export const allowsRegimentsOfRenown = (rulesetId: RulesetId = defaultRulesetId) => {
  return getRulesetData(rulesetId).regimentsOfRenown.length > 0;
};
