import Button from '@components/button';
import Text from '@components/CustomText';
import { useRulesetContext } from '@context/RulesetContext';
import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@hooks/useTheme';
import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RulesetSelectorSheetProps = {
  handleSetVisible: (visible: boolean) => void;
  requestId: number;
  visible: boolean;
};

const RulesetSelectorSheet = ({ handleSetVisible, requestId, visible }: RulesetSelectorSheetProps) => {
  const { availableRulesets, selectedRuleset, selectedRulesetId, setSelectedRulesetId } =
    useRulesetContext();
  const { theme } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const hasPresentedRef = useRef(false);
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  useEffect(() => {
    let presentTimeout: ReturnType<typeof setTimeout> | null = null;

    if (visible) {
      presentTimeout = setTimeout(() => {
        hasPresentedRef.current = true;
        bottomSheetRef.current?.present();
      }, 0);
    } else if (hasPresentedRef.current) {
      bottomSheetRef.current?.close();
    }

    return () => {
      if (presentTimeout) {
        clearTimeout(presentTimeout);
      }
    };
  }, [requestId, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      bottomSheetRef.current?.close();
      handleSetVisible(false);
      return true;
    });

    return () => subscription.remove();
  }, [handleSetVisible, visible]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={['32%']}
      enablePanDownToClose={true}
      detached
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      containerStyle={{ marginHorizontal: 8, borderRadius: 24 }}
      bottomInset={insets.bottom}
      topInset={insets.top}
      style={{ borderRadius: 24 }}
      onDismiss={() => {
        hasPresentedRef.current = false;
        handleSetVisible(false);
      }}
      backgroundStyle={{ backgroundColor: theme.background, borderRadius: 32 }}>
      <BottomSheetView style={styles.sheetContent}>
        <Text variant="heading3" style={styles.sheetTitle}>
          Change Ruleset
        </Text>
        <Text bold style={styles.sheetCurrentRuleset}>
          Current Ruleset: {selectedRuleset.label}
        </Text>
        {availableRulesets.map((ruleset) => {
          const isSelected = ruleset.id === selectedRulesetId;
          return (
            <View key={ruleset.id} style={styles.rulesetButtonContainer}>
              <Button
                onPress={() => {
                  setSelectedRulesetId(ruleset.id);
                  handleSetVisible(false);
                }}
                variant={isSelected ? 'secondary' : 'primary'}>
                <Text bold>{ruleset.label}</Text>
              </Button>
            </View>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RulesetSelectorSheet;

const styles = StyleSheet.create({
  sheetContent: {
    gap: 12,
    paddingBottom: 32,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  sheetTitle: {
    fontSize: 22,
  },
  sheetCurrentRuleset: {
    fontSize: 16,
  },
  rulesetButtonContainer: {
    minHeight: 44,
  },
});
