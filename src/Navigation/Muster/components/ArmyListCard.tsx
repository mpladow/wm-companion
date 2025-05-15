import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useTheme } from '@hooks/useTheme';
import { ArmyListPersistenceType } from 'src/types/models/persistence';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import { Factions } from '@utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import MenuOptionButton from '@components/MenuOptionButton';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

type ArmyListCardV2Prop = {
  userArmy: ArmyListPersistenceType;
  onArmyListCardPress: (armyId: string) => void;
  onToggleFavourite: (armyId: string) => void;
  onDuplicateArmyPress: (armyId: string) => void;

  onArmyNameChange: (armyId: string) => void;
  onDeleteArmyPress: (armyId: string) => void;
};
const ArmyListCardV2 = ({
  userArmy,
  onArmyListCardPress,
  onToggleFavourite,
  onDuplicateArmyPress,
  onArmyNameChange,
  onDeleteArmyPress,
}: ArmyListCardV2Prop) => {
  const { t } = useTranslation(['builder', 'common']);
  const { theme } = useTheme();
  const setImage = () => {
    // const armyName = getKeyByValue(Factions, armyList.faction);
    const armyName = Factions[userArmy.faction];
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
    <Pressable key={userArmy.armyId} onPress={() => onArmyListCardPress(userArmy.armyId)}>
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
            <ThemedText variant="heading3" numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 24 }}>
              {userArmy.name}
            </ThemedText>
          </View>

          <View style={{ marginBottom: 4 }}>
            <Text>{userArmy.faction && getKeyByValue(Factions, userArmy.faction).replaceAll('_', ' ')} </Text>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View>{/* <PointsContainer points={armyList.points} /> */}</View>
            {/* {armyList.armyNotes !== '' && armyList.armyNotes !== undefined ? (
              <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => onOpenArmyNotes(armyList.armyId)}>
                <Foundation name="clipboard-notes" size={24} color={theme.white} />
              </TouchableOpacity>
            ) : null} */}

            {/* {armyList.versionNumber !== CURRENT_VERSION && (
							<Pressable
								style={{ marginLeft: 8 }}
								onPress={() => onMigrateArmyPress(armyList.armyId)}
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
            colors={['rgba(31,46,39, 0.9)', 'rgba(6,9,7, 0.6)', 'rgba(6,9,7, 0.2)', 'rgba(6,9,7, 0.0)']}
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
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <Menu style={{ zIndex: 99 }}>
              <MenuTrigger>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.text} />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  borderRadius: 8,
                  maxWidth: 170,
                  backgroundColor: theme.blueGrey,
                }}>
                <MenuOption onSelect={() => onToggleFavourite(userArmy.armyId)}>
                  <MenuOptionButton
                    icon={<AntDesign name="star" size={18} color={theme.warning} />}
                    variant={'outline'}
                    ButtonText={userArmy.isFavourite ? `${t('RemoveFavourite')}` : `${t('SetFavourite')}`}
                  />
                </MenuOption>

                <MenuOption onSelect={() => onDuplicateArmyPress(userArmy.armyId)}>
                  <MenuOptionButton
                    icon={<FontAwesome name="copy" size={18} color={theme.text} />}
                    variant={'outline'}
                    ButtonText={t('Duplicate', { ns: 'common' })}
                  />
                </MenuOption>
                <MenuOption onSelect={() => onArmyNameChange(userArmy.armyId)}>
                  <MenuOptionButton
                    icon={<FontAwesome name="pencil" size={18} color={theme.text} />}
                    variant={'outline'}
                    ButtonText={t('Edit', { ns: 'common' })}
                  />
                </MenuOption>
                <MenuOption onSelect={() => onDeleteArmyPress(userArmy.armyId)}>
                  <MenuOptionButton
                    icon={<AntDesign name="delete" size={18} color={theme.white} />}
                    variant={'danger'}
                    ButtonText={t('Delete', { ns: 'common' })}
                  />
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ArmyListCardV2;

const styles = StyleSheet.create({
  stretch: {
    // width: 120,
    width: 120,
    height: 150,
    // resizeMode: "contain",
    marginTop: -8,
  },
});
