import { Factions } from '@utils/constants';
import { ArmyReferenceType, RegimentOfRenownArmyReferenceType } from 'src/types/data/army';
import wmaGenericSpecialRules from './json/wma/generic-special-rules/generic-special-rules.json';
import wmaMagicItemsList from './json/wma/magic-items.json';
import wmaAlbionList from './json/wma/albion.json';
import wmaArabyList from './json/wma/araby.json';
import wmaBeastmenList from './json/wma/beastmen.json';
import wmaBretonnianList from './json/wma/bretonnian.json';
import wmaCathayList from './json/wma/cathay.json';
import wmaChaosList from './json/wma/chaos.json';
import wmaChaosDwarvesList from './json/wma/chaosDwarves.json';
import wmaDaemonsList from './json/wma/daemons.json';
import wmaDarkElvesList from './json/wma/darkelves.json';
import wmaDogsOfWarList from './json/wma/dogsOfWar.json';
import wmaDwarvesList from './json/wma/dwarves.json';
import wmaEmpireList from './json/wma/empire.json';
import wmaHighElvesList from './json/wma/highElves.json';
import wmaKislevList from './json/wma/kislev.json';
import wmaLizardmenList from './json/wma/lizardmen.json';
import wmaNightGoblinsList from './json/wma/nightGoblins.json';
import wmaNipponList from './json/wma/nippon.json';
import wmaNorseList from './json/wma/norse.json';
import wmaOgresList from './json/wma/ogres.json';
import wmaOrcList from './json/wma/orks.json';
import wmaSkavenList from './json/wma/skaven.json';
import wmaTombKingsList from './json/wma/tombKings.json';
import wmaVampireCountsList from './json/wma/vampireCounts.json';
import wmaWitchHunterList from './json/wma/witchHunters.json';
import wmaWoodElvesList from './json/wma/woodElves.json';
import {
  regimentsOfReknownListV1 as wmaRegimentsOfReknownListV1,
  wmrArmiesV2 as wmaArmiesV2,
} from './json/wma/v2/_armies';
import wmrGenericSpecialRules from './json/wmr/generic-special-rules/generic-special-rules.json';
import wmrMagicItemsList from './json/wmr/magic-items.json';
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
import wmrHighElvesList from './json/wmr/highElves.json';
import wmrKislevList from './json/wmr/kislev.json';
import wmrLizardmenList from './json/wmr/lizardmen.json';
import wmrNightGoblinsList from './json/wmr/nightGoblins.json';
import wmrNipponList from './json/wmr/nippon.json';
import wmrNorseList from './json/wmr/norse.json';
import wmrOgresList from './json/wmr/ogres.json';
import wmrOrcList from './json/wmr/orks.json';
import wmrSkavenList from './json/wmr/skaven.json';
import wmrTombKingsList from './json/wmr/tombKings.json';
import wmrVampireCountsList from './json/wmr/vampireCounts.json';
import wmrWitchHunterList from './json/wmr/witchHunters.json';
import wmrWoodElvesList from './json/wmr/woodElves.json';
import {
  regimentsOfReknownListV1 as wmrRegimentsOfReknownListV1,
  wmrArmiesV2,
} from './json/wmr/v2/_armies';

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
  legacyArmies: Partial<Record<Factions, ArmyReferenceType>>;
  magicItems: any;
  genericSpecialRules: any;
};

const wmrLegacyArmies: Partial<Record<Factions, ArmyReferenceType>> = {
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

const wmaLegacyArmies: Partial<Record<Factions, ArmyReferenceType>> = {
  [Factions.Bretonnia]: wmaBretonnianList as ArmyReferenceType,
  [Factions.Orcs]: wmaOrcList as ArmyReferenceType,
  [Factions.Tomb_Kings]: wmaTombKingsList as ArmyReferenceType,
  [Factions.Empire]: wmaEmpireList as ArmyReferenceType,
  [Factions.Skaven]: wmaSkavenList as ArmyReferenceType,
  [Factions.Chaos]: wmaChaosList as ArmyReferenceType,
  [Factions.Wood_Elves]: wmaWoodElvesList as ArmyReferenceType,
  [Factions.Vampire_Counts]: wmaVampireCountsList as ArmyReferenceType,
  [Factions.Beastmen]: wmaBeastmenList as ArmyReferenceType,
  [Factions.Cathay]: wmaCathayList as ArmyReferenceType,
  [Factions.Goblins]: wmaNightGoblinsList as ArmyReferenceType,
  [Factions.Dwarfs]: wmaDwarvesList as ArmyReferenceType,
  [Factions.Dark_Elves]: wmaDarkElvesList as ArmyReferenceType,
  [Factions.High_Elves]: wmaHighElvesList as ArmyReferenceType,
  [Factions.Daemons]: wmaDaemonsList as ArmyReferenceType,
  [Factions.Nippon]: wmaNipponList as ArmyReferenceType,
  [Factions.Chaos_Dwarfs]: wmaChaosDwarvesList as ArmyReferenceType,
  [Factions.Dogs_of_War]: wmaDogsOfWarList as ArmyReferenceType,
  [Factions.Araby]: wmaArabyList as ArmyReferenceType,
  [Factions.Lizardmen]: wmaLizardmenList as ArmyReferenceType,
  [Factions.Albion]: wmaAlbionList as ArmyReferenceType,
  [Factions.Ogre_Kingdoms]: wmaOgresList as ArmyReferenceType,
  [Factions.Kislev]: wmaKislevList as ArmyReferenceType,
  [Factions.Norse]: wmaNorseList as ArmyReferenceType,
  [Factions.Witch_Hunters]: wmaWitchHunterList as ArmyReferenceType,
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
