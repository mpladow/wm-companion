import { useRulesetContext } from '@context/RulesetContext';
import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { rulesetIds } from 'src/data/rulesets';

type RulesetLogoProps = {
  height?: ImageStyle['height'];
  style?: StyleProp<ImageStyle>;
  width?: ImageStyle['width'];
};

const RulesetLogo = ({ height = 80, style, width = 200 }: RulesetLogoProps) => {
  const { selectedRulesetId } = useRulesetContext();
  const source =
    selectedRulesetId === rulesetIds.warmasterAncients
      ? require('../../assets/images/wma-full-logo.png')
      : require('../../assets/images/wmr-full-logo.png');

  return <Image resizeMode="contain" source={source} style={[{ height, width }, style]} />;
};

export default RulesetLogo;
