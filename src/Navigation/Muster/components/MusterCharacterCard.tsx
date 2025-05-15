import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { CharacterType, UnitDetailsType } from 'src/types/models/types';
import { useTheme } from '@hooks/useTheme';
import QuickviewProfileHeading from '@navigation/Builder/components/UnitDetailsCard/QuickviewProfileHeading';
import { useTranslation } from 'react-i18next';
import ThemedText from '@components/ThemedText.tsx/ThemedText';

type MusterCharacterCardProps = {
  unit: CharacterType;
  key: string;
  onUnitCardPress: (name: string) => void;
};
const MusterCharacterCard = ({ unit, key, onUnitCardPress }: MusterCharacterCardProps) => {
  console.log('🚀 ~ MusterCharacterCard ~ character:', unit);
  const { t } = useTranslation(['common', 'builder']);

  const { theme } = useTheme();
  return (
    <View key={key} style={{ flexDirection: 'column', overflow: 'hidden', padding: 12, backgroundColor: theme.background }}>
      <>
        <Image
          source={require('../../../../assets/images/card-texture.png')}
          resizeMode="contain"
          style={{ opacity: 0.2, position: 'absolute' }}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* <TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
				<View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
				  <View style={{ marginRight: 8 }}>
					 <UnitIcon type={unit.type} canShoot={unit.range == undefined ? false : true} />
				  </View>
				  <AnimatedView animate={triggerScale}>
					 <Text bold variant="heading3" style={{ fontSize: 18 }}>
						{hasError && <Text style={{ color: theme.warning, fontSize: 18 }}>* </Text>}
						{`${existingUnits} x ${unit.name}`}
					 </Text>
				  </AnimatedView>
				</View>
			 </TouchableOpacity> */}

          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 100, backgroundColor: 'pink' }}>
            <TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
              <View>
                <ThemedText>{unit?.name}</ThemedText>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', marginVertical: 4 }}>
                <>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1 }}>
                      <QuickviewProfileHeading label={t('Command', { ns: 'builder' })} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View>
                        <Text>{unit?.command}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 2 }}>
                      <QuickviewProfileHeading label={t('Attack', { ns: 'builder' })} />
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text>{unit?.attackBonus}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'column' }}></View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    {/* {unitDetailsExpanded?.specialRulesExpanded && unitDetailsExpanded?.specialRulesExpanded?.length > 0 ? (
                        <>
                          <View style={{ flex: 1 }}>
                            <QuickviewProfileHeading label={t('Special', { ns: 'builder' })} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text>{unitDetailsExpanded?.specialRulesExpanded?.length > 0 && 'Yes'}</Text>
                          </View>
                        </>
                      ) : null} */}
                  </View>
                </>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {true ? (
          <TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 4 }}></View>
          </TouchableOpacity>
        ) : null}
      </>
    </View>
  );
};

export default MusterCharacterCard;

const styles = StyleSheet.create({});
