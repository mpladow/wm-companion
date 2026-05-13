import { Text } from '@components/index';
import PointsContainer from '@components/pointsContainer';
import UnitIcon from '@components/UnitCards/UnitIcon';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { PointsLimitType } from '@navigation/ArmyCreation/EditArmy';
import { UnitProps } from '@utils/types';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { get1000PointInterval } from '../utils/builderHelpers';

type UnitCardProps = {
  unit: UnitProps;
  key: number | string;
  onAddUnitPress: (
    unitName: string,
    points: number | undefined,
    isLeader: boolean,
    maxCount?: number,
    minCount?: number,
    ignoreBreakPoint?: boolean,
    isUnique?: boolean,
  ) => void;
  currentCount?: number; // get current count of units in army
  onUnitCardPress: (unitName: string) => void;
  currentArmyCount: number;
  pointsLimit?: PointsLimitType;
  isUnique?: boolean;
};
const UnitCard = ({
  unit,
  key,
  onAddUnitPress,
  currentCount,
  currentArmyCount,
  onUnitCardPress,
  pointsLimit,
  isUnique,
}: UnitCardProps) => {
  const { theme } = useTheme();

  const getUnitArmyMax = () => {
    const interval = get1000PointInterval(
      pointsLimit != undefined ? parseInt(pointsLimit) : currentArmyCount,
    );
    let currentMax: string | undefined = '';
    console.log('🚀 ~ getUnitArmyMax ~ unit.armyMax:', unit.armyMax);
    if (unit.armyMax) {
      currentMax = unit.armyMax.toString();
    } else if (unit.max) {
      currentMax = (unit.max * interval).toString();
    } else {
      currentMax = '-';
    }
    return currentMax;
  };

  const getUnitArmyMin = () => {
    const interval = get1000PointInterval(
      pointsLimit != undefined ? parseInt(pointsLimit) : currentArmyCount,
    );
    let currentMin: string | undefined = '';
    if (unit.armyMin) {
      currentMin = unit.armyMin.toString();
    } else if (unit.min) {
      currentMin = (unit.min * interval).toString();
    } else {
      currentMin = '-';
    }
    return currentMin;
  };

  const totalUnitsCount = useMemo(() => {
    if (unit.armyMin == undefined && unit.armyMax) {
      return `Max ${unit.armyMax}`;
    }
    return `${getUnitArmyMin()} / ${getUnitArmyMax()}`;
  }, []);
  return (
    <Pressable
      onPress={() => onUnitCardPress(unit.name)}
      key={key}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: theme.background,
        padding: 8,
      }}>
      <View style={{ marginRight: 8 }}>
        <UnitIcon
          noCount={currentCount == 0}
          type={unit.type}
          canShoot={unit.range == undefined ? false : true}
          size={'large'}
          isUnique={isUnique ?? false}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Text bold style={{ fontSize: 16 }}>
          {unit.name}
        </Text>

        <View>
          <Text>{currentCount} x units in force</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            flex: 1,
            marginBottom: 4,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          <View style={{ padding: 8, flexDirection: 'row' }}>
            <Text>{totalUnitsCount}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              onAddUnitPress(
                unit.name,
                unit.points,
                unit.command ? true : false,
                unit.armyMax ? unit.armyMax : unit.max,
                unit.armyMin ? unit.armyMin : unit.min,
                unit.noCount,
              )
            }>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ backgroundColor: theme.warning, borderRadius: 4, padding: 4 }}>
                <Entypo name="plus" size={24} color="black" />
              </View>
            </View>
            <View style={{ alignItems: 'flex-start' }}>
              <PointsContainer points={unit.points} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default UnitCard;

const styles = StyleSheet.create({});
