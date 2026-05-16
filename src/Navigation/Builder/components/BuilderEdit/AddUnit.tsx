import { Button, Text } from '@components/index';
import MainContainerWithBlankBG from '@components/MainContainerWithBlankBG';
import { useBuilderContext } from '@context/BuilderContext';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Factions } from '@utils/constants';
import { getGenericSpecialRules } from '@utils/factionHelpers';
import { UnitProps } from '@utils/types';
import { useFactionUnits } from '@utils/useFactionUnits';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { sectionListDataProps } from '../../BuilderEdit';
import ArmyPointsCount from '../ArmyPointsCount';
import ArmyErrorsPreview from '../ErrorsPreview';
import UnitCard from '../UnitCard';
import UnitPreview from '../UnitCardPreview/UnitPreview';

export type AddUnitProps = {
  addingUnits: boolean;
};
const AddUnit = () => {
  const { t } = useTranslation('builder');
  const { theme } = useTheme();
  const route = useRoute();
  const { addingUnits } = route.params;
  const navigation = useNavigation();
  const builder = useBuilderContext();
  const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
  const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState<UnitProps>();
  const [unitPreviewVisible, setUnitPreviewVisible] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1000);
  const [errorsVisible, setErrorsVisible] = useState(false);
  const { getFactionUnitsByVersion } = useFactionUnits();

  useEffect(() => {
    const _currentPoints = builder.calculateCurrentArmyPoints();
    if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000)
      setTotalPoints(2000);
    if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000)
      setTotalPoints(3000);
    if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
    if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
    if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
  }, [builder.calculateCurrentArmyPoints()]);

  useLayoutEffect(() => {
    // get all units for selected army list
    let title;
    if (addingUnits) {
      if (builder.selectedArmyList?.faction == Factions.Chaos) {
        title = t('SpawnUnits');
      } else {
        title = t('RecruitUnits');
      }
    } else {
      if (builder.selectedArmyList?.faction == Factions.Chaos) {
        title = t('SpawnLeaders');
      } else {
        title = t('RecruitLeaders');
      }
    }
    if (builder.selectedArmyList) {
      navigation.setOptions({
        title: title,
      });

      const factionListData = getFactionUnitsByVersion(
        builder.selectedArmyList?.faction,
        builder.selectedArmyList?.versionNumber,
      );
      setFactionUnits(factionListData?.factionList?.units);
    }
  }, [builder.selectedArmyList]);

  useEffect(() => {
    if (builder.selectedArmyList) {
      const factionListData = getFactionUnitsByVersion(
        builder.selectedArmyList?.faction,
        builder.selectedArmyList?.versionNumber,
      );
      setFactionUnits(factionListData?.factionList?.units);
    }
    if (builder?.selectedArmyList) {
      // set leaders
      const _leaders = builder?.selectedArmyList?.selectedUnits
        .filter((x) => x.isLeader)
        .sort((a, b) => (a.order > b.order ? 1 : -1));
      const _frontLineUnits = builder?.selectedArmyList?.selectedUnits
        ?.filter((x) => !x.isLeader)
        .sort((a, b) => (a.order > b.order ? 1 : -1));

      // set frontline
      const _sectionListData: sectionListDataProps[] = [
        { title: 'Leaders', data: _leaders },
        { title: 'Units', data: _frontLineUnits },
      ];

      setSectionListData(_sectionListData);
    }
  }, [builder?.selectedArmyList, builder?.selectedArmyList?.selectedUnits]);

  const armyCount = useMemo(() => {
    return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
  }, [builder.calculateCurrentArmyPoints(), totalPoints]);

  const handleViewPreview = (unitName: string) => {
    const rawUnitData = factionUnits?.find((x) => x.name == unitName);
    let _unit = Object.assign({}, rawUnitData);
    _unit.specialRules = [];
    if (_unit) {
      if (builder.factionDetails?.specialRules && _unit?.name) {
        //@ts-ignore - TODO: need to check typing
        const _specialRulesForUnit = builder.factionDetails?.specialRules[unitName];
        const _allGenericSpecialRules = getGenericSpecialRules();
        if (_specialRulesForUnit) {
          if (_specialRulesForUnit.text && _specialRulesForUnit.text != '') {
            _unit.specialRules.push({ ..._specialRulesForUnit, label: _unit.name });
          } else {
            _unit.specialRules.push(_specialRulesForUnit);
          }
        }
        //@ts-ignore
        const _genericSpecialRulesExist = _allGenericSpecialRules[unitName];

        if (_genericSpecialRulesExist != undefined) {
          _unit.specialRules.push({ ..._genericSpecialRulesExist, label: unitName });
        }
        if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
          rawUnitData.specialRules?.map((x) => {
            if (builder.factionDetails?.specialRules) {
              const specialRule = builder.factionDetails?.specialRules[x];
              _unit.specialRules?.push({ ...specialRule, label: x });
            }
            const genericSpecialRuleFound = _allGenericSpecialRules[x];
            if (genericSpecialRuleFound) {
              _unit.specialRules?.push({ ...genericSpecialRuleFound, label: _unit.name });
            }
          });
        }
      }

      setSelectedUnitDetails(_unit);
      setUnitPreviewVisible(true);
    } else {
      console.error(`UNIT NOT FOUND for ${unitName}`);
    }
  };

  return (
    <MainContainerWithBlankBG>
      <View>
        <FlatList
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          data={
            addingUnits
              ? factionUnits?.filter((x) => !x.command && x.command != 0)
              : factionUnits?.filter((x) => x.command || x.command == 0)
          }
          ListFooterComponentStyle={{ marginTop: 16 }}
          ListFooterComponent={() => (
            <View>
              <Button
                onPress={() => navigation.navigate('AddRegimentsOfRenown')}
                variant={'confirm'}
                style={{ flexDirection: 'row' }}>
                <View style={{ marginRight: 8 }}>
                  <FontAwesome5 name="coins" size={16} color={theme.textInverted} />
                </View>
                <Text style={{ color: theme.textInverted }}>Add Regiments of Renown</Text>
              </Button>
            </View>
          )}
          renderItem={({ item, index }) => {
            const units = addingUnits
              ? sectionListData?.find((x) => x.title == 'Units')?.data
              : sectionListData?.find((x) => x.title == 'Leaders')?.data;
            const _unit = units?.filter((x) => x.unitName == item.name)[0];
            // find current units/leaders in army
            const unitCount = _unit ? _unit.currentCount : 0;
            return (
              <UnitCard
                key={index.toString()}
                unit={item}
                onAddUnitPress={builder.addUnit}
                currentCount={unitCount}
                onUnitCardPress={handleViewPreview}
                currentArmyCount={
                  builder.selectedArmyList?.pointsLimit
                    ? parseInt(builder.selectedArmyList?.pointsLimit)
                    : builder.calculateCurrentArmyPoints()
                }
                onDeleteUnit={() => builder.removeUnit(_unit?.id)}
              />
            );
          }}
        />
        <ArmyErrorsPreview
          handleSetVisible={() => setErrorsVisible(!errorsVisible)}
          visible={errorsVisible}
          armyErrors={builder.armyErrors}
        />
      </View>
      <View style={{ zIndex: 9, position: 'absolute', bottom: 10, left: 20, flexDirection: 'row' }}>
        {/* TODO extract out  */}
        <ArmyPointsCount
          armyErrorsCount={builder.armyErrors.length}
          setVisibility={(visibility) => setErrorsVisible(visibility)}
          armyCount={armyCount}
        />
      </View>
      <View
        style={{ zIndex: 9, position: 'absolute', bottom: 10, right: 20, flexDirection: 'row' }}>
        {/* TODO extract out  */}
        <Button onPress={() => navigation.goBack()} variant={'primary'}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
              paddingRight: 12,
            }}>
            <Entypo name="chevron-left" size={16} color={theme.text} />
            <Text bold>Back</Text>
          </View>
        </Button>
      </View>
      {selectedUnitDetails ? (
        <UnitPreview
          handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
          visible={unitPreviewVisible}
          selectedUnitDetails={selectedUnitDetails}
        />
      ) : null}
    </MainContainerWithBlankBG>
  );
};

export default AddUnit;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    //backgroundColor: 'blue',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
