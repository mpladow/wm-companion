import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@hooks/useTheme';
import ThemedText from '@components/ThemedText.tsx/ThemedText';

type ButtonType = 'primary' | 'secondary' | 'confirm' | 'danger';
export type size = 'sm' | 'lg';

type ThemedButtonProps = {
  onPress: () => void;
  style?: any;
  buttonType: ButtonType;
  variant: 'text' | 'ghost' | 'filled';
  buttonSize: 'sm' | 'default';
  children: ReactNode | string;
  disabled?: boolean;
  circle?: boolean;
  size?: size;
};
const ThemedButton = ({
  children,
  onPress,
  variant,
  buttonSize,
  buttonType,
  circle,
  disabled,
  size,
  style,
}: ThemedButtonProps) => {
  const [pressing, setPressing] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    // setPressing(pressing);
    if (pressing) onPress();
  }, [pressing]);

  const colourType = useMemo(() => {
    switch (buttonType) {
      case 'confirm':
        return {
          backgroundColor: theme.warning,
          invertedColor: theme.black,
          primaryColor: theme.warning,
        };
      case 'danger':
        return { backgroundColor: 'red', invertedColor: theme.black, primaryColor: 'red' };

      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          invertedColor: theme.black,
          primaryColor: theme.white,
        };
      case 'primary':
        return {
          backgroundColor: theme.primary,
          invertedColor: theme.black,
          primaryColor: theme.primary,
        };
      default:
        return {
          backgroundColor: theme.secondary,
          invertedColor: theme.black,
          primaryColor: theme.primary,
        };
    }
  }, [buttonType]);

  const setSize = useMemo(() => {
    switch (buttonSize) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12 };
        break;
      case 'default':
        return { paddingVertical: 16, paddingHorizontal: 28 };
      default:
        return { paddingVertical: 16, paddingHorizontal: 28 };

        break;
    }
  }, []);

  const setVariant = useMemo(() => {
    switch (variant) {
      case 'filled':
        return {
          borderColor: colourType.primaryColor,
          borderWidth: 2,
          backgroundColor: colourType.primaryColor,
          color: colourType.invertedColor,
        };
        break;
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colourType.primaryColor,
          color: colourType.primaryColor,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          color: colourType.primaryColor,
        };
      default:
        return {
          borderColor: colourType.primaryColor,
          borderWidth: 2,
          backgroundColor: colourType.primaryColor,
          color: colourType.invertedColor,
        };
        break;
    }
  }, [variant, colourType]);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}
      hitSlop={20}
      // activeOpacity={0.8}
      style={[
        styles.button,
        circle && styles.buttonRound,
        setSize,
        { alignItems: 'center', elevation: pressing ? 0 : 8 },
        setVariant,
        disabled && styles.disabled,
        setSize,
        style,
      ]}>
      {typeof children == 'string' ? (
        <ThemedText bold style={{ color: setVariant.color }}>
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    elevation: 4,
    padding: 16,
    backgroundColor: 'grey',
    borderRadius: 28,
    boxShadow: `0px 0px 18px 8px rgba(0, 0, 0, 0.80)`,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  large: {
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  buttonRound: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    width: 70,
    height: 70,
    maxWidth: 100,
    maxHeight: 100,
  },
  disabled: {
    opacity: 0.5,
  },
});
