import Constants from 'expo-constants';
import { defaultRulesetId, RulesetId, rulesetIds } from 'src/data/rulesets';

export const getRulesetArmyVersion = (rulesetId: RulesetId = defaultRulesetId) => {
  if (rulesetId === rulesetIds.warmasterAncients) {
    return Constants.expoConfig?.extra?.wmaArmyVersion ?? 1;
  }

  return Constants.expoConfig?.extra?.armyVersion;
};
