import { Text } from '@components/index';
import UpgradeIcon from '@components/UnitCards/UpgradeIcon';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '@hooks/useTheme';
import { UpgradeTypes } from '@utils/constants';
import { UpgradesProps } from '@utils/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UpgradePreviewProps = {
  handleSetVisible: (visible: boolean) => void;
  visible: boolean;
  selectedUpgradeDetails?: UpgradesProps;
};
const UpgradePreview = ({
  handleSetVisible,
  visible,
  selectedUpgradeDetails,
}: UpgradePreviewProps) => {
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
    console.log('🚀 ~ BuilderEdit ~ unitPreviewVisible:', visible);
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss;
    }
  }, [visible]);
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
        console.log('DISMIGGING');
      }}
      backgroundStyle={{ backgroundColor: theme.grey3, borderRadius: 32 }}>
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flex: 1, marginBottom: 8 }}>
            <ImageBackground
              source={require('../../../../assets/images/wm-bg2.jpeg')}
              resizeMode="cover"
              style={[
                styles.image,
                { paddingVertical: 40 },
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
                  bottom: -0,
                  height: Dimensions.get('screen').height / 2,
                  zIndex: 9,
                }}></LinearGradient>
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
                    {selectedUpgradeDetails?.name}
                  </Text>
                  {/* <Text
                    variant="heading3"
                    style={{
                      fontSize: 16,
                      color: theme.white,
                      zIndex: 9999,
                    }}>
                    Bases: {selectedUpgradeDetails.size}
                  </Text> */}
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                  <View
                    style={{
                      zIndex: 99,
                      flex: 1,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <UpgradeIcon
                      size={'large'}
                      type={selectedUpgradeDetails?.type as UpgradeTypes}
                    />
                    <Text bold style={{ fontSize: 16 }}>
                      {selectedUpgradeDetails?.type}
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View style={{ zIndex: 99, flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <UpgradeIcon type={selectedUpgradeDetails?.type as UpgradeTypes} />

                <Text bold style={{ fontSize: 16 }}>
                  {selectedUpgradeDetails?.type}
                </Text>
              </View> */}
            </ImageBackground>
          </View>
          {/* <View style={{ flex: 1, marginBottom: 8 }}>
     				<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
     					<UpgradeIcon type={selectedUpgradeDetails?.type as UpgradeTypes} />
     					<Text bold style={{ fontSize: 16 }}>
     						{selectedUpgradeDetails?.type}
     					</Text>
     				</View>
     			</View> */}
          <View style={{ padding: 12 }}>
            {selectedUpgradeDetails?.attack ? (
              <View
                style={{
                  flex: 3,
                  marginBottom: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                  <Text>{t('attack', { ns: 'builder' })}</Text>
                  <Text style={{ fontSize: STAT_FONT_SIZE }}>{selectedUpgradeDetails?.attack}</Text>
                </View>
              </View>
            ) : null}

            {selectedUpgradeDetails && selectedUpgradeDetails?.text?.length > 0 ? (
              <View style={{ flex: 3, justifyContent: 'center', flexDirection: 'column' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  {selectedUpgradeDetails?.text?.map((x) => {
                    if (x)
                      return (
                        <View style={{ marginBottom: 8, alignItems: 'flex-start' }}>
                          <Text>{x}</Text>
                        </View>
                      );
                  })}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default UpgradePreview;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    top: 0,
  },
});
