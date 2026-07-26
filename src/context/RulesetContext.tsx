import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultRulesetId,
  isRulesetId,
  RULESET_STORAGE_KEY,
  rulesets,
  RulesetDefinition,
  RulesetId,
} from 'src/data/rulesets';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type RulesetContextInterface = {
  availableRulesets: RulesetDefinition[];
  closeRulesetSelector: () => void;
  openRulesetSelector: () => void;
  rulesetSelectorRequestId: number;
  rulesetSelectorVisible: boolean;
  selectedRuleset: RulesetDefinition;
  selectedRulesetId: RulesetId;
  setSelectedRulesetId: (rulesetId: RulesetId) => void;
};

const defaultRuleset = rulesets.find((ruleset) => ruleset.id === defaultRulesetId) ?? rulesets[0];

const RulesetContext = createContext<RulesetContextInterface>({
  availableRulesets: rulesets,
  closeRulesetSelector: () => {},
  openRulesetSelector: () => {},
  rulesetSelectorRequestId: 0,
  rulesetSelectorVisible: false,
  selectedRuleset: defaultRuleset,
  selectedRulesetId: defaultRulesetId,
  setSelectedRulesetId: () => {},
});

export const RulesetContextProvider = ({ children }: any) => {
  const [selectedRulesetId, setSelectedRulesetIdState] = useState<RulesetId>(defaultRulesetId);
  const [rulesetSelectorRequestId, setRulesetSelectorRequestId] = useState(0);
  const [rulesetSelectorVisible, setRulesetSelectorVisible] = useState(false);

  useEffect(() => {
    const loadRuleset = async () => {
      try {
        const storedRuleset = await AsyncStorage.getItem(RULESET_STORAGE_KEY);
        if (storedRuleset && isRulesetId(storedRuleset)) {
          setSelectedRulesetIdState(storedRuleset);
        }
      } catch (e) {}
    };

    loadRuleset();
  }, []);

  const setSelectedRulesetId = (rulesetId: RulesetId) => {
    setSelectedRulesetIdState(rulesetId);
    AsyncStorage.setItem(RULESET_STORAGE_KEY, rulesetId);
  };

  const openRulesetSelector = () => {
    setRulesetSelectorVisible(true);
    setRulesetSelectorRequestId((current) => current + 1);
  };

  const closeRulesetSelector = () => {
    setRulesetSelectorVisible(false);
  };

  const selectedRuleset = useMemo(
    () => rulesets.find((ruleset) => ruleset.id === selectedRulesetId) ?? defaultRuleset,
    [selectedRulesetId],
  );

  return (
    <RulesetContext.Provider
      value={{
        availableRulesets: rulesets,
        closeRulesetSelector,
        openRulesetSelector,
        rulesetSelectorRequestId,
        rulesetSelectorVisible,
        selectedRuleset,
        selectedRulesetId,
        setSelectedRulesetId,
      }}>
      {children}
    </RulesetContext.Provider>
  );
};

export const useRulesetContext = () => {
  return useContext(RulesetContext);
};
