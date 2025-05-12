import { StyleSheet, Text, TextProps, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTheme } from '@hooks/useTheme';
import fonts from '@utils/fonts';

export type TextVariant = 'bold' | 'heading1' | 'heading2' | 'heading3';
type CustomTypeProps = {
  variant?: TextVariant;
  bold?: boolean;
  italic?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  style?: TextProps;
} & TextProps;
const ThemedText = ({ children, variant, bold, italic, size, ...props }: CustomTypeProps) => {
  const { theme } = useTheme();
  const fontSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 12;

        break;
      case 'default':
        return 16;
      case 'lg':
        return 20;
      case 'xl':
        return 28;
      default:
        return 16;
        break;
    }
  }, [size]);

  const setTextFont = () => {
    switch (variant) {
      case 'heading1':
        return fonts.PTSansBold;
        break;
      case 'heading2':
        return fonts.PTSansBold;
        break;
      case 'heading3':
        return fonts.BarlowCodensedBold;
      case 'bold':
        if (bold) return fonts.PTSansBold;
        if (italic) return fonts.PTSansItalic;
        else return fonts.PTSansRegular;
      default:
        if (italic) return fonts.PTSansItalic;
        if (bold) return fonts.PTSansBold;
        return fonts.PTSansRegular;
    }
  };

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: setTextFont(),
          color: theme.text,
          fontSize: fontSize,
        },
        props.style,
      ]}>
      {children}
    </Text>
  );
};

export default ThemedText;
