import Text from '@components/CustomText';
import { useRulesetContext } from '@context/RulesetContext';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RulesetHomeMenu = () => {
  const { openRulesetSelector, selectedRuleset } = useRulesetContext();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);

  const handleChangeRulesetPress = () => {
    setShowMenu(false);
    openRulesetSelector();
  };

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Popover
        isVisible={showMenu}
        mode={PopoverMode.JS_MODAL}
        placement={PopoverPlacement.BOTTOM}
        onRequestClose={() => setShowMenu(false)}
        popoverStyle={{ borderRadius: 16 }}
        backgroundStyle={styles.popoverBackground}
        arrowSize={{ width: 0, height: 0 }}
        animationConfig={{ duration: 0 }}
        displayAreaInsets={insets}
        from={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open ruleset menu"
            hitSlop={8}
            onPress={() => setShowMenu((current) => !current)}
            style={[
              styles.iconButton,
              styles.anchorButton,
              { backgroundColor: theme.blueGrey, top: insets.top + 12 },
            ]}>
            <Entypo name="dots-three-vertical" size={20} color={theme.text} />
          </Pressable>
        }>
        <View style={[styles.menu, { backgroundColor: theme.blueGrey }]}>
          <Text bold style={styles.currentRuleset}>
            Current Ruleset: {selectedRuleset.label}
          </Text>
          <TouchableOpacity
            onPress={handleChangeRulesetPress}
            style={[styles.menuButton, { backgroundColor: theme.backgroundVariant2 }]}>
            <Entypo name="cycle" size={18} color={theme.text} />
            <Text>Change Ruleset</Text>
          </TouchableOpacity>
        </View>
      </Popover>
    </View>
  );
};

export default RulesetHomeMenu;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    elevation: 20,
    zIndex: 999,
  },
  anchorButton: {
    position: 'absolute',
    right: 16,
    zIndex: 999,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  menu: {
    borderRadius: 16,
    gap: 12,
    maxWidth: 260,
    minWidth: 240,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  currentRuleset: {
    fontSize: 14,
  },
  menuButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  popoverBackground: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
