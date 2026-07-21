import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

type LogoWmrProps = {
  height?: ImageStyle['height'];
  style?: StyleProp<ImageStyle>;
  width?: ImageStyle['width'];
};

const LogoWmr = ({ height = 80, style, width = 200 }: LogoWmrProps) => (
  <Image
    resizeMode="contain"
    source={require('../../../assets/images/wmr-full-logo.png')}
    style={[{ height, width }, style]}
  />
);

export default LogoWmr;
