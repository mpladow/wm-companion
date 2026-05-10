import { Text } from '@components/index';
import UnitIcon from '@components/UnitCards/UnitIcon';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '@hooks/useTheme';
import { sanitizeText } from '@navigation/Builder/utils/builderHelpers';
import { UnitProps } from '@utils/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatContainer from './StatContainer';
const unitPreviewBackground = require('../../../../../assets/images/wm-bg2.jpeg');

type UnitPreviewProps = {
  handleSetVisible: (visible: boolean) => void;
  visible: boolean;
  selectedUnitDetails: UnitProps;
};
const UnitPreview = ({ handleSetVisible, visible, selectedUnitDetails }: UnitPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['common', 'builder']);

  const unitPreviewBottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const STAT_FONT_SIZE = 22;
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  useEffect(() => {
    console.log('🚀 ~ BuilderEdit ~ unitPreviewVisible:', visible);
    if (visible) {
      unitPreviewBottomSheetRef.current?.present();
    } else {
      unitPreviewBottomSheetRef.current?.dismiss;
    }
  }, [visible]);
  const renderArmyMinMaxText = useMemo(() => {
    if (selectedUnitDetails.armyMax != null && selectedUnitDetails.armyMin != null) {
      console.log('🚀 ~ UnitPreview ~ selectedUnitDetails:', selectedUnitDetails);
      if (selectedUnitDetails.armyMax == selectedUnitDetails.armyMin) {
        return true;
      }
    }
  }, [selectedUnitDetails]);
  return (
    <BottomSheetModal
      ref={unitPreviewBottomSheetRef}
      index={0}
      enablePanDownToClose={true}
      detached
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      containerStyle={{ marginHorizontal: 8, borderRadius: 24 }}
      bottomInset={insets.bottom}
      topInset={insets.top}
      style={{ borderRadius: 24 }}
      onDismiss={() => {
        handleSetVisible(false);
        console.log('DISMIGGING');
      }}
      backgroundStyle={{ backgroundColor: theme.background, borderRadius: 32 }}>
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator>
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              flex: 1,
              marginBottom: 8,
            }}>
            <ImageBackground
              source={unitPreviewBackground}
              resizeMode="cover"
              style={[
                styles.image,
                { paddingVertical: 12 },
                {
                  borderTopWidth: 2,
                  borderBottomWidth: 2,
                  borderTopColor: theme.white,
                  borderBottomColor: theme.white,
                },
              ]}>
              <LinearGradient
                colors={['rgba(31,46,39, 0.4)', 'rgba(6,9,7, 0.9)']}
                start={{ y: 0, x: 0.5 }}
                end={{ y: 0.5, x: 0 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -1,
                  // height: Dimensions.get('screen').height / 2,
                  height: 300,
                  zIndex: 9,
                }}
              />

              <View
                style={{
                  paddingHorizontal: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text
                    bold
                    variant="heading3"
                    style={{
                      fontSize: 24,
                      color: theme.white,
                      zIndex: 9999,
                    }}>
                    {selectedUnitDetails.name}
                  </Text>
                  <Text
                    variant="heading3"
                    style={{
                      fontSize: 16,
                      color: theme.white,
                      zIndex: 9999,
                    }}>
                    Bases: {selectedUnitDetails.size}
                  </Text>
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                  <View
                    style={{
                      zIndex: 99,
                      flex: 1,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <UnitIcon
                      size={'large'}
                      type={selectedUnitDetails.type}
                      canShoot={selectedUnitDetails.range == undefined ? false : true}
                    />
                    <Text bold style={{ fontSize: 16 }}>
                      {selectedUnitDetails.type}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              backgroundColor: theme.white,
              marginHorizontal: 12,
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderRadius: 12,
            }}>
            <View
              style={{
                zIndex: 99,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingLeft: 12,
              }}>
              <Text italic variant="heading3" style={{ fontSize: 16, color: theme.blueGrey }}>
                Selection Limits
              </Text>
              {renderArmyMinMaxText ? (
                <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                  Only {selectedUnitDetails.armyMax} can exist in a list.
                </Text>
              ) : null}
              {!renderArmyMinMaxText && selectedUnitDetails.armyMin ? (
                <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                  A minimum of {selectedUnitDetails.armyMax} is required in a list.
                </Text>
              ) : null}
              {selectedUnitDetails.min ? (
                <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                  A minimum of {selectedUnitDetails.min} is required per 1000 points
                </Text>
              ) : null}
              {selectedUnitDetails.max ? (
                <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                  A maximum of {selectedUnitDetails.max} is permitted per 1000 points
                </Text>
              ) : null}
              {selectedUnitDetails.min == null &&
              selectedUnitDetails.max == null &&
              selectedUnitDetails.armyMax == null &&
              selectedUnitDetails.armyMin == null ? (
                <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                  You can select as many as you want.
                </Text>
              ) : null}
              {selectedUnitDetails.requiredUnits !== null
                ? selectedUnitDetails.requiredUnits?.map((item) => (
                    <Text italic style={{ fontSize: 16, color: theme.blueGrey }}>
                      A/An {item} must also be in this list to include this unit.
                    </Text>
                  ))
                : null}
            </View>
          </View>
          <View
            style={{
              borderRadius: 12,
              paddingVertical: 8,
              padding: 8,
            }}>
            {selectedUnitDetails.command ? (
              <View
                style={{
                  flex: 3,
                  marginBottom: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                  <StatContainer
                    statName={'Command'}
                    statValue={selectedUnitDetails.command.toString()}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                  <StatContainer
                    statName={'Attack Bonus'}
                    statValue={selectedUnitDetails.attack?.toString()}
                  />
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flex: 3,
                    marginBottom: 8,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <StatContainer
                      statName={t('Attack', { ns: 'builder' })}
                      statValue={selectedUnitDetails.attack?.toString()}
                    />
                  </View>
                  {selectedUnitDetails.range ? (
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                      <StatContainer
                        statName={t('Range', { ns: 'builder' })}
                        statValue={selectedUnitDetails.range?.toString() || '-'}
                      />
                    </View>
                  ) : null}
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <StatContainer
                      statName={t('Hits', { ns: 'builder' })}
                      statValue={selectedUnitDetails.hits?.toString() || '-'}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <StatContainer
                      statName={t('Armour', { ns: 'builder' })}
                      statValue={selectedUnitDetails.armour?.toString() || '-'}
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <StatContainer
                      statName={'Size'}
                      statValue={selectedUnitDetails.size?.toString() || '-'}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
          {selectedUnitDetails.specialRules && selectedUnitDetails.specialRules.length > 0 ? (
            <View
              style={{
                flex: 3,
                justifyContent: 'center',
                flexDirection: 'column',
                padding: 12,
              }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ marginTop: 8 }}>
                  <Text bold style={{ fontSize: 20, marginBottom: 8 }}>
                    {t('SpecialRules')}
                  </Text>
                  {selectedUnitDetails.specialRules?.map((x) => {
                    return x?.text?.map((rule, index) => {
                      let sanitized = sanitizeText(rule, theme.text);
                      return (
                        <View key={index} style={{ marginBottom: 8 }}>
                          <Text style={{ color: theme.text }}>{sanitized}</Text>
                        </View>
                      );
                    });
                  })}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default UnitPreview;
const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    top: 0,
  },
});
