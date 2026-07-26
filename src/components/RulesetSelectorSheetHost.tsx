import RulesetSelectorSheet from '@components/RulesetSelectorSheet';
import { useRulesetContext } from '@context/RulesetContext';
import React from 'react';

const RulesetSelectorSheetHost = () => {
  const { closeRulesetSelector, rulesetSelectorRequestId, rulesetSelectorVisible } =
    useRulesetContext();

  return (
    <RulesetSelectorSheet
      requestId={rulesetSelectorRequestId}
      visible={rulesetSelectorVisible}
      handleSetVisible={(visible) => {
        if (!visible) {
          closeRulesetSelector();
        }
      }}
    />
  );
};

export default RulesetSelectorSheetHost;
