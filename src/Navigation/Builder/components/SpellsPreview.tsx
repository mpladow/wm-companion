import { Text } from '@components/index';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheetBack } from '@hooks/useBottomSheetBackHandler';
import { useTheme } from '@hooks/useTheme';
import { sanitizeText } from '@navigation/Builder/utils/builderHelpers';
import { SpellsProps } from '@utils/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CollapsibleComponent from './Collapsible';
const unitPreviewBackground = require('../../../../assets/images/wm-bg2.jpeg');

type SpellsPreviewProps = {
  handleSetVisible: (visible: boolean) => void;
  visible: boolean;
  spells: SpellsProps[];
};
const SpellsPreview = ({ handleSetVisible, visible, spells }: SpellsPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['common', 'builder']);

  const spellsPreviewBottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const STAT_FONT_SIZE = 22;
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  useEffect(() => {
    if (visible) {
      spellsPreviewBottomSheetRef.current?.present();
    } else {
      spellsPreviewBottomSheetRef.current?.dismiss;
    }
  }, [visible]);

  const renderDiceIcon = (value?: number) => {
    switch (value) {
      case 2:
        return <FontAwesome5 name="dice-two" size={16} color="black" />;
      case 3:
        return <FontAwesome5 name="dice-three" size={16} color="black" />;
      case 4:
        return <FontAwesome5 name="dice-four" size={16} color="black" />;
      case 5:
        return <FontAwesome5 name="dice-five" size={16} color="black" />;
      case 6:
        return <FontAwesome5 name="dice-six" size={16} color="black" />;
      default:
        return <FontAwesome5 name="dice-d6" size={16} color="black" />;
    }
  };
  const renderItem = useCallback(
    (item) => (
      <CollapsibleComponent
        headerLeftComponent={
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {renderDiceIcon(item.roll)}
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 16, color: theme.black }}>{item.roll}+</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
                  <Entypo name="ruler" size={16} color="black" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: theme.black }}>{item.range ? item.range : '-'}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 2, justifyContent: 'flex-start', paddingLeft: 8 }}>
              <Text bold style={{ fontSize: 16, color: theme.black }}>
                {item.name}
              </Text>
            </View>
          </View>
        }
        collapsableContent={
          <View style={{ flexDirection: 'column', marginVertical: 12 }}>
            {item.text?.map((x) => {
              let _item = x;
              const sanitized = sanitizeText(_item, theme.black);
              return <Text style={{ color: theme.black }}>{sanitized}</Text>;
            })}
          </View>
        }
      />
    ),
    [],
  );

  useBottomSheetBack(visible, spellsPreviewBottomSheetRef, () => handleSetVisible(false));
  return (
    <BottomSheetModal
      ref={spellsPreviewBottomSheetRef}
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
      backgroundStyle={{
        backgroundColor: theme.success,
        borderRadius: 32,
        paddingLeft: 40,
      }}>
      <BottomSheetScrollView
        scrollEnabled
        style={{ height: Dimensions.get('window').height * 0.8 }}
        contentContainerStyle={{
          //   paddingTop: 16,
          flexGrow: 1,
        }}>
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
                Spells
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
        <>{spells.map(renderItem)}</>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default SpellsPreview;
const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    top: 0,
  },
});
