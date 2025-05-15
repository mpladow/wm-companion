import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { UnitDetailsType } from 'src/types/models/types';
import { useTheme } from '@hooks/useTheme';
import { useTranslation } from 'react-i18next';
import QuickviewProfileHeading from '@navigation/Builder/components/UnitDetailsCard/QuickviewProfileHeading';
import UnitIcon from '@components/UnitCards/UnitIcon';
import AnimatedView from '@components/Animated/AnimatedView';
import ThemedText from '@components/ThemedText.tsx/ThemedText';

type MusterUnitCardProps = {
  unit: UnitDetailsType;
  totalForUnit: number;
  key: string;
  onUnitCardPress: (name: string) => void;
};
const MusterUnitCard = ({ unit, totalForUnit, key, onUnitCardPress }: MusterUnitCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['common', 'builder']);

  return (
    <View key={key} style={{ flexDirection: 'column', overflow: 'hidden', padding: 12, backgroundColor: theme.background }}>
      <>
        <Image
          source={require('../../../../assets/images/card-texture.png')}
          resizeMode="contain"
          style={{ opacity: 0.2, position: 'absolute' }}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginRight: 8 }}>
                <UnitIcon type={unit.type} canShoot={unit.range == undefined ? false : true} />
              </View>
              <View>
                <ThemedText style={{ fontSize: 18 }}>
                  {false && <Text style={{ color: theme.warning, fontSize: 18 }}>* </Text>}
                  {`${totalForUnit} x ${unit.name}`}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                marginRight: 12,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  marginLeft: 12,
                  marginRight: 12,
                }}>
                {/* <PointsContainer points={unit.points} /> */}
              </View>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: 40 }}>
                {/* <Text>
                  {unit.armyMin ? unit.armyMax : unit.min} / <Text bold>{getUnitArmyMax()}</Text>
                </Text> */}
              </View>
            </View>
            <View style={{ flex: 1.4, flexDirection: 'column' }}>
              <View style={{ flex: 2 }}>
                <QuickviewProfileHeading label={t('Attack', { ns: 'builder' })} />
              </View>
              <View style={{ flex: 2 }}>
                <Text>{unit?.attack}</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1 }}>
                <QuickviewProfileHeading label={t('Hits', { ns: 'builder' })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text>{unit?.hits}</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1 }}>
                <QuickviewProfileHeading label={t('Armour', { ns: 'builder' })} />
              </View>
              <View style={{ flex: 1 }}>
                <Text>{unit?.armour ? unit.armour : '-'}</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              {unit?.range ? (
                <>
                  <View style={{ flex: 1 }}>
                    <QuickviewProfileHeading label={t('Range', { ns: 'builder' })} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{unit.range}</Text>
                  </View>
                </>
              ) : null}
            </View>
            {/* <UnitDetailsMenu
              noMagic={unit.noMagic}
              onAddUnit={() =>
                onAddUnit(
                  unit.name,
                  unit.points,
                  unit.command ? true : false,
                  unit.armyMax ? unit.armyMax : unit.max,
                  unit.armyMin ? unit.armyMin : unit.min,
                  unit.noCount
                )
              }
              onAddUpgrade={() => onAddUpgrade(key)}
              onDeleteUnit={() => onDeleteUnit(key)}
            /> */}
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

export default MusterUnitCard;

const styles = StyleSheet.create({});
