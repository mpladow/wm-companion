import { Text } from '@components/index';
import PointsContainer from '@components/pointsContainer';
import { ArmyListProps } from '@context/BuilderContext';
import { AntDesign, FontAwesome, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { Factions } from '@utils/constants';
import { getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

type ArmyListCardProps = {
  armyList: ArmyListProps;
  handleArmyListPress: (armyId: string) => void;
  handleDeleteArmyPress: (armyId: string) => void;
  handleArmyNameChange: (armyId: string) => void;
  handleDuplicateArmyPress: (armyId: string) => void;
  handleToggleFavourite: (armyId: string) => void;
  handleOpenArmyNotes: (armyId: string) => void;
  handleMigrateArmyPress: (armyId: string) => void;
};
const ArmyListCard = ({
  armyList,
  handleArmyListPress,
  handleDeleteArmyPress,
  handleArmyNameChange,
  handleDuplicateArmyPress,
  handleToggleFavourite,
  handleOpenArmyNotes,
  handleMigrateArmyPress,
}: ArmyListCardProps) => {
  const { t } = useTranslation(['builder', 'common']);
  const { theme } = useTheme();
  const [showPopover, setShowPopover] = useState(false);

  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;
  const setImage = () => {
    // const armyName = getKeyByValue(Factions, armyList.faction);
    const armyName = Factions[armyList.faction];
    const factionAssets = getLocalFactionAssets(armyName ? armyName : '');
    return (
      <View
        style={{
          backgroundColor: 'black',
          position: 'absolute',
          top: 0,
          borderLeftColor: theme.white,
          borderLeftWidth: 4,
        }}>
        <Image style={[styles.stretch]} source={factionAssets && factionAssets[0]} />
      </View>
    );
  };

  return (
    <TouchableOpacity key={armyList.armyId} onPress={() => handleArmyListPress(armyList.armyId)}>
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: theme.background,
          borderRadius: 8,
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: theme.grey3,
        }}>
        <Image
          source={require('../../../../assets/images/card-texture.png')}
          resizeMode="contain"
          style={{ opacity: 0.2, position: 'absolute' }}
        />
        <View style={{ flex: 3, margin: 16 }}>
          <View style={{ marginBottom: 4, flex: 1, paddingRight: 30 }}>
            <Text
              variant="heading3"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontSize: 24 }}>
              {armyList.name}
            </Text>
          </View>

          <View style={{ marginBottom: 4 }}>
            <Text>
              {armyList.faction &&
                getKeyByValue(Factions, armyList.faction).replaceAll('_', ' ')}{' '}
            </Text>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View>
              <PointsContainer points={armyList.points} maxPoints={armyList.pointsLimit} />
            </View>
            {armyList.armyNotes !== '' && armyList.armyNotes !== undefined ? (
              <TouchableOpacity
                hitSlop={18}
                style={{ marginLeft: 12 }}
                onPress={() => handleOpenArmyNotes(armyList.armyId)}>
                <Foundation name="clipboard-notes" size={24} color={theme.white} />
              </TouchableOpacity>
            ) : null}

            {/* {armyList.versionNumber !== CURRENT_VERSION && (
							<Pressable
								style={{ marginLeft: 8 }}
								onPress={() => handleMigrateArmyPress(armyList.armyId)}
							>
								<View
									style={{
										backgroundColor: "blue",
										padding: 4,
										paddingHorizontal: 8,
										borderRadius: 4,
									}}
								>
									<Text style={{ marginLeft: 4, numberOfLines: 2 }}>
										Migrate to {CURRENT_VERSION}
									</Text>
								</View>
							</Pressable>
						)} */}
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
          {setImage()}
          <LinearGradient
            colors={[
              'rgba(31,46,39, 0.9)',
              'rgba(6,9,7, 0.6)',
              'rgba(6,9,7, 0.2)',
              'rgba(6,9,7, 0.0)',
            ]}
            start={{ y: 0, x: 1 }}
            end={{ y: 0, x: 0 }}
            style={{
              position: 'absolute',
              left: -40,
              right: 0,
              bottom: -0,
              width: 150,
              height: 300,
              zIndex: 9,
            }}></LinearGradient>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}>
            {armyList.versionNumber !== CURRENT_VERSION && (
              <Pressable
                style={{ marginLeft: 8 }}
                onPress={() => handleMigrateArmyPress(armyList.armyId)}>
                <View
                  style={{
                    padding: 12,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    width: 80,
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      resizeMode: 'cover',
                      position: 'absolute',
                      top: -0,
                      left: 2,
                      width: 80,
                      height: 80,
                    }}
                    source={require('../../../images/svgs/red_seal.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      numberOfLines: 2,
                      textAlign: 'center',
                      color: theme.text,
                    }}>
                    <AntDesign name="warning" size={24} color={theme.text} />
                    {/* Migrate to {CURRENT_VERSION} */}
                  </Text>
                </View>
              </Pressable>
            )}
            <Popover
              isVisible={showPopover}
              placement={PopoverPlacement.LEFT}
              onRequestClose={() => setShowPopover(false)}
              popoverStyle={{ borderRadius: 24 }}
              arrowSize={{ width: 0, height: 0 }}
              from={
                <View>
                  <Pressable onPress={() => setShowPopover(true)} hitSlop={36}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.text} />
                  </Pressable>
                </View>
              }>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  maxWidth: 200,
                  backgroundColor: theme.backgroundVariant,
                  flex: 1,
                  borderRadius: 24,
                  overflow: 'hidden',
                  gap: 12,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowPopover(false);
                    handleToggleFavourite(armyList.armyId);
                  }}
                  style={[
                    { flex: 1, flexDirection: 'row', paddingVertical: 8 },
                    styles.menuButtons,
                  ]}>
                  <View style={{ marginRight: 8 }}>
                    <AntDesign name="star" size={18} color={theme.warning} />
                  </View>
                  <Text>{armyList.isFavourite ? 'Remove Favourite' : 'Set Favourite'}</Text>
                </TouchableOpacity>
                {armyList.versionNumber !== CURRENT_VERSION && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPopover(false);
                      handleMigrateArmyPress(armyList.armyId);
                    }}
                    style={[
                      { flex: 1, flexDirection: 'row', paddingVertical: 8 },
                      styles.menuButtons,
                    ]}>
                    <View style={{ marginRight: 8 }}>
                      <MaterialCommunityIcons name="transfer-right" size={18} color={theme.text} />
                    </View>
                    <Text>{t('Migrate', { ns: 'common' })}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setShowPopover(false);
                    handleDuplicateArmyPress(armyList.armyId);
                  }}
                  style={[
                    { flex: 1, flexDirection: 'row', paddingVertical: 8 },
                    styles.menuButtons,
                  ]}>
                  <View style={{ marginRight: 8 }}>
                    <FontAwesome name="copy" size={18} color={theme.text} />
                  </View>
                  <Text>{t('Duplicate', { ns: 'common' })}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowPopover(false);
                    handleArmyNameChange(armyList.armyId);
                  }}
                  style={[
                    { flex: 1, flexDirection: 'row', paddingVertical: 8 },
                    styles.menuButtons,
                  ]}>
                  <View style={{ marginRight: 10 }}>
                    <FontAwesome name="pencil" size={18} color={theme.text} />
                  </View>
                  <Text>{t('Edit', { ns: 'common' })}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowPopover(false);
                    handleDeleteArmyPress(armyList.armyId);
                  }}
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      paddingVertical: 8,
                      backgroundColor: theme.danger,
                    },
                    styles.menuButtons,
                  ]}>
                  <View style={{ marginRight: 8 }}>
                    <AntDesign name="delete" size={18} color={theme.text} />
                  </View>
                  <Text>{t('Delete', { ns: 'common' })}</Text>
                </TouchableOpacity>
              </View>
            </Popover>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArmyListCard;

const styles = StyleSheet.create({
  stretch: {
    // width: 120,
    width: 120,
    height: 150,
    // resizeMode: "contain",
    marginTop: -8,
  },
  menuButtons: {
    paddingLeft: 12,
    paddingRight: 44,
    borderRadius: 16,
    minHeight: 40,
    alignItems: 'center',
  },
});
