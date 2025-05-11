import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import UpgradePreview from '../components/UpgradePreview';
import UnitPreview from '../components/UnitCardPreview/UnitPreview';
import SpellBookModal from '../components/SpellBookModal';
import UnitDetailsCard from '../components/UnitDetailsCard';
import { LinearGradient } from 'expo-linear-gradient';
import SpecialRulesCollapsible from '../components/SpecialRulesCollapsible';
import { getUpgradeDetailsByName } from '../utils/builderHelpers';
import { getGenericSpecialRules, getKeyByValue } from '@utils/factionHelpers';
import { sectionListDataProps } from '../BuilderEdit';
import { Factions } from '@utils/constants';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useFactionUnits } from '@utils/useFactionUnits';
import { UnitProps, UpgradesProps } from '@utils/types';
import { useTranslation } from 'react-i18next';
import { useBuilderContext } from '@context/BuilderContext';
import { useTheme } from '@hooks/useTheme';
import { useSettingsContext } from '@context/SettingsContext';
import { Entypo } from '@expo/vector-icons';
import ArmyPointsCount from '../components/ArmyPointsCount';
import { Button, CustomCheckbox, Text, TextBlock } from '@components/index';
import { useBuilderV2Context } from '@context/v2/BuilderV2Context';
import { useFactionDataContext } from '@context/v2/FactionDataContext';
import { CharacterPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';
import { useBuilderEditor } from '../hooks/useBuilderEditor';
import { useBuilderEditorV2 } from '@context/v2/BuilderEditorContext';
import { CharacterType, UnitDetailsType } from 'src/types/models/types';
import ThemedText from '@components/ThemedText.tsx/ThemedText';

export type SelctionListDataV2 = {
  title: string;
  data: UnitDetailsType[] | CharacterType[] | [];
};
const BuilderEditV2 = ({ navigation, route }: any) => {
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const builder = useBuilderContext();
  // const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings, setShowStatlineSetting } = useSettingsContext();
  //modals
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [spellsVisible, setSpellsVisible] = useState(false);
  const [unitPreviewVisible, setUnitPreviewVisible] = useState(false);
  const [upgradePreviewVisible, setUpgradePreviewVisible] = useState(false);
  // show statline
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(1000); // this state will update itself as the current points exceeds the previous value
  const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
  const [showFactionInfo, setShowFactionInfo] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState<UnitProps>();
  const [currentUpgradeDetails, setCurrentUpgradeDetails] = useState<UpgradesProps | undefined>();

  const [sectionListData, setSectionListData] = useState<SelctionListDataV2[]>([]);

  const { getFactionUnitsByVersion } = useFactionUnits();
  const [selectedArmyId, setSelectedArmyId] = useState<string>();

  //   const {
  //     allUserArmies,
  //     getArmyById,
  //     deleteArmyById,
  //     selectedArmyList,
  //     handleSetFocusedArmyByArmyId,
  //   } = useBuilderV2Context();

  const x = useFactionDataContext();

  useEffect(() => {
    if (route?.params['armyId']) {
      setSelectedArmyId(route?.params?.armyId);
    }
  }, [navigation, route]);

  console.log('🚀 ~ BuilderEditV2 ~ selectedArmyId:', selectedArmyId);

  const { currentArmy, currentArmyVM } = useBuilderEditorV2(selectedArmyId);

  //   useEffect(() => {
  //     if (selectedArmyId) {
  //       handleSetFocusedArmyByArmyId(selectedArmyId);
  //     }
  //   }, [selectedArmyId]);

  useEffect(() => {
    if (currentArmyVM) {
      navigation.setOptions({
        title: currentArmyVM.name,
        headerRight: () => (
          <Menu>
            <MenuTrigger>
              <Entypo name="dots-three-vertical" size={20} color={theme.text} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate('BuilderQuickView')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Entypo name="export" size={20} color="black" />
                  </View>
                  <View style={{ flex: 5, padding: 4, paddingVertical: 8 }}>
                    <Text style={{ color: theme.black }}>{t('ExportList')}</Text>
                  </View>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ),
        headerTitle: () => (
          <View style={{ width: 250 }}>
            <Text numberOfLines={1} variant="heading1" style={{ fontSize: 20 }}>
              {currentArmyVM.name ?? 'Builder'}
            </Text>
            <Text>{currentArmyVM.name && currentArmyVM.faction?.replaceAll('_', ' ')}</Text>
          </View>
        ),
      });
    }
  }, [currentArmyVM]);

  useEffect(() => {
    const _currentPoints = builder.calculateCurrentArmyPoints();
    if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000) setTotalPoints(2000);
    if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000) setTotalPoints(3000);
    if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
    if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
    if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
  }, [builder.calculateCurrentArmyPoints()]);

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
  useEffect(() => {
    if (factionUnits && builder.selectedArmyList) {
      // update total points
      let pointsCount = 0;
      currentArmy?.selectedCharacters.forEach((unit) => {
        const currentUnit = factionUnits.find((x) => x.name == unit.name);
        if (currentUnit?.points) pointsCount += currentUnit.points;
        // if attached unit has items, calculate value for that too
      });
      setCurrentPoints(pointsCount);
    }
  }, [factionUnits, builder.selectedArmyList]);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [units, setUnits] = useState<UnitDetailsType[]>([]);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ currentArmy:', currentArmyVM);
    if (currentArmyVM) {
      // set leaders

      const _leaders = currentArmyVM?.selectedCharacters.sort((a, b) => (a.order > b.order ? 1 : -1));
      console.log('🚀 ~ useEffect ~ _leaders:', _leaders);
      setCharacters(_leaders ?? []);

      const _frontLineUnits = currentArmyVM?.selectedUnits.sort((a, b) => (a.order > b.order ? 1 : -1));
      setUnits(_frontLineUnits ?? []);
      console.log('🚀 ~ useEffect ~ _frontLineUnits:', _frontLineUnits);

      // set frontline
      const _sectionListData: SelctionListDataV2[] = [
        { title: 'Leaders', data: _leaders ?? [] },
        { title: 'Units', data: _frontLineUnits ?? [] },
      ];

      setSectionListData(_sectionListData);
    }
  }, [currentArmyVM]);

  const handleRemoveUnit = (unitId: string) => {
    builder.removeUnit(unitId);
  };

  const handleOnUnitCardPress = (unitName: string) => {
    const rawUnitData = factionUnits?.find((x) => x.name == unitName);
    let _unit = Object.assign({}, rawUnitData);
    _unit.specialRules = [];
    if (_unit) {
      if (builder.factionDetails?.specialRules && _unit?.name) {
        //@ts-ignore - TODO: need to check typing
        const _specialRulesForUnit = builder.factionDetails?.specialRules[unitName];
        const _allGenericSpecialRules = getGenericSpecialRules();
        //@ts-ignore
        const _genericSpecialRulesExist = _allGenericSpecialRules[unitName];
        console.log('🚀 ~ handleOnUnitCardPress ~ unitName:', unitName);
        console.log('🚀 ~ handleOnUnitCardPress ~ _genericSpecialRulesExist:', _genericSpecialRulesExist);
        if (_specialRulesForUnit) {
          if (_specialRulesForUnit.text) _unit.specialRules.push(_specialRulesForUnit);
          // setSpecialRules(_specialRules);
        }
        if (_genericSpecialRulesExist != undefined) {
          console.log('handleOnUnitCardPress:: generic special rule found');
          _unit.specialRules.push(_genericSpecialRulesExist);
        }
        if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
          console.log('handleOnUnitCardPress:: special rule for UNIT UPGRADE');

          rawUnitData.specialRules?.map((x) => {
            if (builder.factionDetails?.specialRules) {
              const specialRule = builder.factionDetails?.specialRules[x];
              _unit.specialRules?.push(specialRule);
            }
            const genericSpecialRuleFound = _allGenericSpecialRules[x];
            if (genericSpecialRuleFound) {
              _unit.specialRules?.push(genericSpecialRuleFound);
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
    return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
  }, [builder.calculateCurrentArmyPoints(), totalPoints]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* list all units */}
      {builder.factionDetails?.armyRules ? (
        <SpecialRulesCollapsible
          toggleVisible={() => setShowFactionInfo(!showFactionInfo)}
          visible={!showFactionInfo}
          title={t('ArmySpecialRules')}
          contents={builder.factionDetails.armyRules}
        />
      ) : null}
      {/* Spell list, break point */}
      <LinearGradient
        colors={['rgba(31,46,39, 0.4)', 'rgba(6,9,7, 0.9)']}
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
        <View>
          {builder.factionDetails?.name !== 'Dwarfs' && builder.factionDetails?.name !== 'Nippon' ? (
            <Button onPress={() => setSpellsVisible(!spellsVisible)} variant={'default'}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: 8 }}>
                  <Entypo name="open-book" size={20} color={theme.white} />
                </View>
                <Text bold>{t('Spells')}</Text>
              </View>
            </Button>
          ) : null}
        </View>
      </View>
      <View style={{ backgroundColor: 'green', zIndex: 9 }}>
        <FlatList
          data={characters}
          ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: 'black' }}></View>}
          renderItem={({ item, index }) => (
            <View style={{ height: 50, backgroundColor: 'white' }}>
              <ThemedText>{item.name}</ThemedText>
            </View>
          )}
        />
        <FlatList
          data={units}
          ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: 'black' }}></View>}
          renderItem={({ item, index }) => (
            <View style={{ height: 50, backgroundColor: 'white' }}>
              <ThemedText style={{ color: 'blue' }}>{item.name}</ThemedText>
            </View>
          )}
        />
      </View>

      {/* // points verification container */}
      <View style={{ zIndex: 9, position: 'absolute', bottom: 10, left: 20, flexDirection: 'row' }}>
        {/* TODO extract out  */}
        <ArmyPointsCount
          armyErrorsCount={builder.armyErrors.length}
          setVisibility={(visibility) => setErrorsVisible(visibility)}
          armyCount={armyCount}
        />
      </View>

      {/* {All selected upgrades modal} */}
      {/* <AllSelectedUpgradesModal
				setVisible={(vis) => setAllSelectedUpgradesVisible(vis)}
				visible={allSelectedUpgradesVisible}
				headerTitle={"Selected Upgrades"}
				upgrades={magicItems}
				selectedUpgrades={builder.selectedArmyList?.selectedUpgrades}
			/> */}
      {/* // add new new */}
      <UpgradePreview
        handleSetVisible={(visibility) => setUpgradePreviewVisible(visibility)}
        visible={upgradePreviewVisible}
        selectedUpgradeDetails={currentUpgradeDetails}
      />
      {selectedUnitDetails ? (
        <UnitPreview
          handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
          visible={unitPreviewVisible}
          selectedUnitDetails={selectedUnitDetails}
        />
      ) : null}
      {builder.factionDetails?.spells ? (
        <SpellBookModal
          handleSetVisible={(visibility) => setSpellsVisible(visibility)}
          visible={spellsVisible}
          spells={builder.factionDetails?.spells}
        />
      ) : null}
      <Modal animationType="fade" visible={errorsVisible} transparent={true}>
        <View style={styles.modalOverlay} onTouchStart={() => setErrorsVisible(!errorsVisible)}>
          <View
            style={{
              marginTop: 500,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.text,
              padding: 16,
              margin: 12,
              borderRadius: 20,
            }}>
            <FlatList
              data={builder.armyErrors}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text style={{ color: theme.black }}>{item.error}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BuilderEditV2;

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
