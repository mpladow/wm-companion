import { Text } from '@components/index';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheetBack } from '@hooks/useBottomSheetBackHandler';
import { useTheme } from '@hooks/useTheme';
import { ArmyErrorsProps } from '@utils/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const unitPreviewBackground = require('../../../../assets/images/wm-bg2.jpeg');

type ArmyErrorsPreviewProps = {
  handleSetVisible: (visible: boolean) => void;
  visible: boolean;
  armyErrors?: ArmyErrorsProps[];
};
const ArmyErrorsPreview = ({ handleSetVisible, visible, armyErrors }: ArmyErrorsPreviewProps) => {
  const STAT_FONT_SIZE = 22;
  const { theme } = useTheme();
  const { t } = useTranslation(['common', 'builder']);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss;
    }
  }, [visible]);

  useBottomSheetBack(visible, bottomSheetRef, () => handleSetVisible(!visible));

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
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
      }}
      backgroundStyle={{ backgroundColor: theme.yellow, borderRadius: 32 }}>
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator>
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
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
                  height: 200,
                  zIndex: 9,
                }}
              />
              <View
                style={{
                  paddingHorizontal: 12,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  bold
                  variant="heading3"
                  style={{
                    fontSize: 24,
                    color: theme.white,
                    zIndex: 9999,
                  }}>
                  Errors
                </Text>
                <View style={{ justifyContent: 'flex-end' }}>
                  <View
                    style={{
                      zIndex: 99,
                      flex: 1,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    {/* insert right */}
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              justifyContent: 'center',
              backgroundColor: theme.text,
              padding: 16,
              margin: 12,
              borderRadius: 20,
            }}>
            {armyErrors?.map((item) => {
              return (
                <View style={{ marginBottom: 4 }}>
                  <Text bold style={{ color: theme.textInverted }}>
                    {item.sourceName}
                  </Text>
                  <Text style={{ color: theme.textInverted }}>{item.error}</Text>
                </View>
              );
            })}
            {/* <FlatList
              data={armyErrors}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 4 }}>
                    <Text bold style={{ color: theme.textInverted }}>
                      {item.sourceName}
                    </Text>
                    <Text style={{ color: theme.textInverted }}>{item.error}</Text>
                  </View>
                );
              }}
            /> */}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default ArmyErrorsPreview;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    top: 0,
  },
});
