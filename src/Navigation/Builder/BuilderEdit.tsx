import FactionImages from '@components/FactionImages';
import HeaderMenu from '@components/HeaderMenu';
import { CustomCheckbox, Text } from '@components/index';
import { SelectedUnitProps, useBuilderContext } from '@context/BuilderContext';
import { useSettingsContext } from '@context/SettingsContext';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { Factions } from '@utils/constants';
import { getGenericSpecialRules, getKeyByValue } from '@utils/factionHelpers';
import { UnitProps, UpgradesProps } from '@utils/types';
import { useFactionUnits } from '@utils/useFactionUnits';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RegimentOfRenownUnitReferenceType } from 'src/types/data/army';
import ArmyPointsCount from './components/ArmyPointsCount';
import ArmyErrorsPreview from './components/ErrorsPreview';
import SpecialRulesCollapsible from './components/SpecialRulesCollapsible';
import SpellsPreview from './components/SpellsPreview';
import RegimentsOfRenownPreview from './components/UnitCardPreview/RegimentsOfRenownPreview';
import UnitPreview from './components/UnitCardPreview/UnitPreview';
import UnitDetailsCard from './components/UnitDetailsCard';
import UpgradePreview from './components/UpgradePreview';
import { getUpgradeDetailsByName } from './utils/builderHelpers';

export type sectionListDataProps = {
  title: string;
  data: SelectedUnitProps[];
};
const BuilderEdit = ({ navigation }: any) => {
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const builder = useBuilderContext();
  // const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings, setShowStatlineSetting } = useSettingsContext();
  //modals
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [unitPreviewVisible, setUnitPreviewVisible] = useState(false);
  const [upgradePreviewVisible, setUpgradePreviewVisible] = useState(false);

  // show statline
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(1000); // this state will update itself as the current points exceeds the previous value
  const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
  const [regimentsOfRenown, setRegimentsOfRenown] = useState<RegimentOfRenownUnitReferenceType[]>();
  const [showFactionInfo, setShowFactionInfo] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState<UnitProps>();
  const [selectedRoRDetails, setSelectedRoRDetails] = useState<RegimentOfRenownUnitReferenceType>();
  const [currentUpgradeDetails, setCurrentUpgradeDetails] = useState<UpgradesProps | undefined>();
  const [showSpells, setShowSpells] = useState(false);

  const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);

  const {
    getFactionUnitsByVersion,
    getRegimentsOfRenownForFaction,
    getRegimentsOfRenownFactionData,
  } = useFactionUnits();

  useLayoutEffect(() => {
    const factionListData = getFactionUnitsByVersion(
      builder.selectedArmyList?.faction,
      builder.selectedArmyList?.versionNumber,
    );
    setFactionUnits(factionListData?.factionList?.units);
    const RoRData = getRegimentsOfRenownForFaction(builder.selectedArmyList?.faction);
    setRegimentsOfRenown(RoRData);
    // get all units for selected army list
    if (builder.selectedArmyList?.faction && builder.selectedArmyList.name) {
      navigation.setOptions({
        title: builder.selectedArmyList?.name,
        headerRight: () => <HeaderMenu armyId={builder.selectedArmyList?.armyId} factionId={builder.selectedArmyList?.faction}/>,
        headerTitle: () => (
          <View style={{ width: 250 }}>
            <Text numberOfLines={1} variant="heading1" style={{ fontSize: 20 }}>
              {builder.selectedArmyList?.name ?? 'Builder'}
            </Text>
            <Text>
              {builder.selectedArmyList?.name &&
                getKeyByValue(Factions, builder.selectedArmyList.faction)?.replaceAll('_', ' ')}
              {builder.selectedArmyList?.pointsLimit &&
                ` - ${builder.selectedArmyList?.pointsLimit}pts`}
            </Text>
          </View>
        ),
      });
    }
  }, [navigation, builder.selectedArmyList]);



  useEffect(() => {
    const _currentPoints = builder.calculateCurrentArmyPoints();
    if (builder.selectedArmyList?.pointsLimit != undefined) {
      setTotalPoints(parseInt(builder.selectedArmyList.pointsLimit));
      return;
    }
    if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000)
      setTotalPoints(2000);
    if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000)
      setTotalPoints(3000);
    if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
    if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
    if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
  }, [builder.calculateCurrentArmyPoints(), builder.selectedArmyList?.pointsLimit]);

  useEffect(() => {
    if (factionUnits && builder.selectedArmyList) {
      // update total points
      let pointsCount = 0;
      builder.selectedArmyList?.selectedUnits.forEach((unit) => {
        const currentUnit = factionUnits.find((x) => x.name == unit.unitName);
        if (currentUnit?.points) pointsCount += currentUnit.points;
        // if attached unit has items, calculate value for that too
      });
      setCurrentPoints(pointsCount);
    }
  }, [factionUnits, builder.selectedArmyList]);

  useEffect(() => {
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

  const handleAddUnitToArmyPress = (
    unitName: string,
    points: number | undefined,
    isLeader: boolean,
    maxCount?: number,
    minCount?: number,
    ignoreBreakPoint?: boolean,
  ) => {
    builder.addUnit(unitName, points, isLeader, maxCount, minCount, ignoreBreakPoint);
  };

  const handleRemoveUpgrade = (unitName: string, id: string) => {
    builder.removeItem(unitName, id);
  };

  const handleRemoveUnit = (unitId: string) => {
    builder.removeUnit(unitId);
  };

  const handleOnUnitCardPress = (unitName: string) => {
    const rawUnitData = factionUnits?.find((x) => x.name == unitName);
    let _unit = Object.assign({}, rawUnitData);
    _unit.specialRules = [];
    if (rawUnitData) {
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
      // find details for RoR unit
      const rawUnitData = regimentsOfRenown?.find((x) => x.name == unitName);
      let _unit = Object.assign({}, rawUnitData);
      _unit.specialRules = [];
      if (_unit) {
        if (regimentsOfRenown && _unit?.name) {
          // get special rules for units name.
          //@ts-ignore - TODO: need to check typing
          const data = getRegimentsOfRenownFactionData();
          const _specialRulesForUnit = data?.specialRules[unitName];
          const _allGenericSpecialRules = getGenericSpecialRules();
          //@ts-ignore
          const _genericSpecialRulesExist = _allGenericSpecialRules[unitName];
          if (_specialRulesForUnit) {
            if (_specialRulesForUnit.text && _specialRulesForUnit.text != '') {
              _unit.specialRules.push({ ..._specialRulesForUnit, label: _unit.name });
            } else {
              _unit.specialRules.push(_specialRulesForUnit);
            }
            // setSpecialRules(_specialRules);
          }
          if (_genericSpecialRulesExist != undefined) {
            _unit.specialRules.push(_genericSpecialRulesExist);
          }
          if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
            rawUnitData.specialRules?.map((x) => {
              if (data?.specialRules) {
                const specialRule = data?.specialRules[x];
                _unit.specialRules?.push({ ...specialRule, label: x });
              }
              const genericSpecialRuleFound = _allGenericSpecialRules[x];
              if (genericSpecialRuleFound && genericSpecialRuleFound !== '') {
                _unit.specialRules?.push({ ...genericSpecialRuleFound, label: _unit.name });
              } else {
                _unit.specialRules?.push(genericSpecialRuleFound);
              }
            });
          }
        }
        setSelectedRoRDetails(_unit);
        setUnitPreviewVisible(true);
      }
    }
  };
  const getUnitDetailsByUnitName = (unitName: string) => {
    const rawUnitData = factionUnits?.find((x) => x.name == unitName);
    let _unit = Object.assign({}, rawUnitData);

    if (rawUnitData) {
      if (builder.factionDetails?.specialRules && _unit?.name) {
        const _specialRules = builder.factionDetails?.specialRules[unitName];
        const _allGenericSpecialRules = getGenericSpecialRules();
        //@ts-ignore
        const _genericSpecialRulesExist = _allGenericSpecialRules[_unit.name];

        let _unitAdditionalDate = Object.assign({}, _unit);
        _unitAdditionalDate['specialRulesExpanded'] = [];
        if (_specialRules?.text != undefined) {
          _unitAdditionalDate['specialRulesExpanded']?.push(_specialRules);
        }
        if (_genericSpecialRulesExist != undefined) {
          _unitAdditionalDate['specialRulesExpanded']?.push(_genericSpecialRulesExist);
        }
        if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
          rawUnitData.specialRules?.map((x) => {
            if (builder.factionDetails?.specialRules) {
              const specialRule = builder.factionDetails?.specialRules[x];
              _unitAdditionalDate['specialRulesExpanded'].push(specialRule);
            }
          });
        }

        return _unitAdditionalDate;
      }
    } else {
      // find details for RoR unit
      const rawUnitData = regimentsOfRenown?.find((x) => x.name == unitName);
      let _unit = Object.assign({}, rawUnitData);
      _unit.specialRules = [];
      if (_unit) {
        if (regimentsOfRenown && _unit?.name) {
          // get special rules for units name.
          //@ts-ignore - TODO: need to check typing
          const data = getRegimentsOfRenownFactionData();
          const _specialRulesForUnit = data?.specialRules[unitName];
          const _allGenericSpecialRules = getGenericSpecialRules();
          //@ts-ignore
          const _genericSpecialRulesExist = _allGenericSpecialRules[unitName];
          if (_specialRulesForUnit) {
            if (_specialRulesForUnit.text && _specialRulesForUnit.text != '') {
              _unit.specialRules.push({ ..._specialRulesForUnit, label: _unit.name });
            } else {
              _unit.specialRules.push(_specialRulesForUnit);
            }
            // setSpecialRules(_specialRules);
          }
          if (_genericSpecialRulesExist != undefined) {
            _unit.specialRules.push(_genericSpecialRulesExist);
          }
          if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
            rawUnitData.specialRules?.map((x) => {
              if (data?.specialRules) {
                const specialRule = data?.specialRules[x];
                _unit.specialRules?.push({ ...specialRule, label: x });
              }
              const genericSpecialRuleFound = _allGenericSpecialRules[x];
              if (genericSpecialRuleFound && genericSpecialRuleFound !== '') {
                _unit.specialRules?.push({ ...genericSpecialRuleFound, label: _unit.name });
              } else {
                _unit.specialRules?.push(genericSpecialRuleFound);
              }
            });
          }
        }
      }
    }
  };
  const handleOnUpgradePress = (upgradeName: string) => {
    if (builder.factionDetails) {
      const _upgrades = getUpgradeDetailsByName(upgradeName, builder.factionDetails);
      // let _upgrades: UpgradesProps | undefined = magicItemsList.upgrades.find((x) => x.name == upgradeName);
      // if (!_upgrades?.text) {
      // 	_upgrades = builder.factionDetails?.upgrades?.find((x) => x.name == upgradeName);
      if (_upgrades && _upgrades?.text == null) {
        // find upgrade text fromm special rules
        const specialRules = builder.factionDetails?.specialRules[upgradeName];
        if (specialRules) {
          _upgrades.text = specialRules.text;
        }
      }
      // }
      if (_upgrades) {
        console.log('upgrade found');
        setCurrentUpgradeDetails(_upgrades);
        setUpgradePreviewVisible(true);
      } else {
        console.error('upgrade not found');
      }
    }
  };

  const armyCount = useMemo(() => {
    return `${builder.calculateCurrentArmyPoints()}/${builder.totalPoints}`;
  }, [builder.calculateCurrentArmyPoints(), builder.totalPoints]);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.backgroundVariant2 }}>
        {/* list all units */}
        <>
          {builder.factionDetails?.armyRules ? (
            <View style={{ paddingTop: 8, paddingHorizontal: 8 }}>
              <SpecialRulesCollapsible
                toggleVisible={() => setShowFactionInfo(!showFactionInfo)}
                visible={!showFactionInfo}
                title={t('ArmySpecialRules')}
                contents={builder.factionDetails.armyRules}
              />
            </View>
          ) : null}
          {/* Spell list, break point */}

          <LinearGradient
            colors={['rgba(31,46,39, 0.1)', 'rgba(6,9,7, 0.3)']}
            start={{ y: 0, x: 0.5 }}
            end={{ y: 0.5, x: 0 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -0,
              height: Dimensions.get('screen').height,
              zIndex: 9,
            }}></LinearGradient>

          <View
            style={{
              zIndex: 9,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}>
            <View>
              <Text style={{ fontSize: 16 }}>{builder.getUnitCounts()}</Text>
            </View>
            <CustomCheckbox
              onValueChange={() => setShowStatlineSetting()}
              value={settings.showStatline}
              label={t('ShowStatline')}
            />
          </View>
        </>
        <SectionList
          ListHeaderComponent={
            <FactionImages
              factionId={parseInt(builder.selectedArmyList?.faction)}
              imageStyle={{ height: 150 }}
            />
          }
          style={{ zIndex: 9 }}
          ListFooterComponent={() => <View style={{ padding: 40 }}></View>}
          sections={sectionListData}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                alignItems: 'center',
                padding: 12,
                backgroundColor: theme.backgroundVariant2,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text variant="heading3" style={{ fontSize: 20, textTransform: 'uppercase' }}>
                {title}
              </Text>
              {/* //TODO: Extract into seperate button */}
              <TouchableOpacity
                onPress={() => navigation.navigate('AddUnit', { addingUnits: title != 'Leaders' })}>
                <View style={{ backgroundColor: theme.accent, borderRadius: 8, padding: 4 }}>
                  <Entypo name="plus" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 2, backgroundColor: 'black' }}></View>
          )}
          renderItem={({ item, index }) => {
            // get total unit count
            const unitDetails = factionUnits?.find((x) => x.name == item.unitName);
            const regimentOfRenown = getRegimentsOfRenownForFaction().find(
              (x) => x.name == item.unitName,
            );
            if (unitDetails) {
              return (
                <>
                  <UnitDetailsCard
                    key={`unitDetails_${item.id}`}
                    existingUnits={item.currentCount}
                    unit={unitDetails}
                    unitUpgrades={item.attachedItems}
                    onShowUnitDetails={() => console.log('showUnitDetails')}
                    onAddUnit={handleAddUnitToArmyPress}
                    onDeleteUnit={() => handleRemoveUnit(item.id)}
                    onAddUpgrade={() =>
                      navigation.navigate('AddItem', {
                        unitName: item.unitName,
                        unitType: unitDetails.type,
                      })
                    }
                    onRemoveUpgrade={handleRemoveUpgrade}
                    onUnitCardPress={handleOnUnitCardPress}
                    onUpgradePress={handleOnUpgradePress}
                    currentArmyCount={builder.calculateCurrentArmyPoints()}
                    hasError={
                      builder.armyErrors.findIndex((x) => x.sourceName == item.unitName) > -1
                    }
                    unitDetailsExpanded={getUnitDetailsByUnitName(item.unitName)}
                    showStatline={settings.showStatline}
                    pointsLimit={builder.selectedArmyList?.pointsLimit}
                  />
                </>
              );
            } else if (regimentOfRenown) {
              return (
                <>
                  <UnitDetailsCard
                    key={`unitDetails_${item.id}`}
                    existingUnits={item.currentCount}
                    unit={regimentOfRenown}
                    unitUpgrades={item.attachedItems}
                    onShowUnitDetails={() => console.log('showUnitDetails')}
                    onAddUnit={handleAddUnitToArmyPress}
                    onDeleteUnit={() => handleRemoveUnit(item.id)}
                    onAddUpgrade={() =>
                      navigation.navigate('AddItem', {
                        unitName: item.unitName,
                        unitType: regimentOfRenown.type,
                      })
                    }
                    onRemoveUpgrade={handleRemoveUpgrade}
                    onUnitCardPress={handleOnUnitCardPress}
                    onUpgradePress={handleOnUpgradePress}
                    currentArmyCount={builder.calculateCurrentArmyPoints()}
                    hasError={
                      builder.armyErrors.findIndex((x) => x.sourceName == item.unitName) > -1
                    }
                    unitDetailsExpanded={getUnitDetailsByUnitName(item.unitName)}
                    showStatline={settings.showStatline}
                    pointsLimit={builder.selectedArmyList?.pointsLimit}
                    isUnique={true}
                  />
                </>
              );
            } else {
              return <Text>Unit Not Found - create a new list</Text>;
            }
          }}
        />
        {/* // points verification container */}
        <View
          style={{
            zIndex: 9,
            position: 'absolute',
            bottom: 10,
            left: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // width: Dimensions.get('screen').width - 40,
          }}>
          {/* TODO extract out  */}
          <ArmyPointsCount
            armyErrorsCount={builder.armyErrors.length}
            setVisibility={(visibility) => setErrorsVisible(visibility)}
            armyCount={armyCount}
          />
        </View>
        <View
          style={{
            zIndex: 9,
            position: 'absolute',
            bottom: 10,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            {builder.factionDetails?.name !== 'Dwarfs' &&
            builder.factionDetails?.name !== 'Nippon' ? (
              <TouchableOpacity
                onPress={() => setShowSpells(!showSpells)}
                style={{
                  backgroundColor: theme.success,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  alignContent: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <View>
                    <Entypo name="open-book" size={40} color={theme.white} />
                  </View>
                  <Text bold>{t('Spells')}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {/* {All selected upgrades modal} */}
        <UpgradePreview
          handleSetVisible={(visibility) => setUpgradePreviewVisible(visibility)}
          visible={upgradePreviewVisible}
          selectedUpgradeDetails={currentUpgradeDetails}
        />
        {selectedUnitDetails ? (
          <UnitPreview
            handleSetVisible={() => {
              setSelectedUnitDetails(undefined);
              return setUnitPreviewVisible(!unitPreviewVisible);
            }}
            visible={unitPreviewVisible}
            selectedUnitDetails={selectedUnitDetails}
          />
        ) : selectedRoRDetails ? (
          <RegimentsOfRenownPreview
            handleSetVisible={() => {
              setSelectedUnitDetails(undefined);
              return setUnitPreviewVisible(!unitPreviewVisible);
            }}
            visible={unitPreviewVisible}
            selectedUnitDetails={selectedRoRDetails}
          />
        ) : null}
        <ArmyErrorsPreview
          armyErrors={builder.armyErrors}
          handleSetVisible={() => setErrorsVisible(!errorsVisible)}
          visible={errorsVisible}
        />
        {builder.factionDetails?.spells ? (
          <>
            <SpellsPreview
              handleSetVisible={() => setShowSpells(!showSpells)}
              visible={showSpells}
              spells={builder.factionDetails?.spells}
            />
          </>
        ) : null}
      </View>
    </>
  );
};

export default BuilderEdit;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    //  justifyContent: 'center',
    //  top: 0,
    minHeight: 16,
  },
  menuButtons: {
    paddingLeft: 12,
    paddingRight: 44,
    borderRadius: 16,
    minHeight: 40,
    alignItems: 'center',
  },
});
