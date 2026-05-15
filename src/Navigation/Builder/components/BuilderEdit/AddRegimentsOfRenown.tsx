import { Button, Text } from '@components/index';
import MainContainerWithBlankBG from '@components/MainContainerWithBlankBG';
import { useBuilderContext } from '@context/BuilderContext';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getGenericSpecialRules } from '@utils/factionHelpers';
import { useFactionUnits } from '@utils/useFactionUnits';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { RegimentOfRenownUnitReferenceType } from 'src/types/data/army';
import { sectionListDataProps } from '../../BuilderEdit';
import ArmyPointsCount from '../ArmyPointsCount';
import CollapsibleComponent from '../Collapsible';
import UnitCard from '../UnitCard';
import RegimentsOfRenownPreview from '../UnitCardPreview/RegimentsOfRenownPreview';

export type AddRegimentsOfRenownProps = {
  addingUnits: boolean;
};
const AddRegimentsOfRenown = () => {
  const { t } = useTranslation('builder');
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const builder = useBuilderContext();
  const [regimentsOfRenown, setRegimentsOfRenown] = useState<
    RegimentOfRenownUnitReferenceType[] | undefined
  >();
  const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);
  const [selectedUnitDetails, setSelectedUnitDetails] =
    useState<RegimentOfRenownUnitReferenceType>();
  const [unitPreviewVisible, setUnitPreviewVisible] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1000);
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [regimentsOfRenownDetails, setRegimentsOfRenownDetails] =
    useState<RegimentOfRenownUnitReferenceType[]>();

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

    if (builder.selectedArmyList) {
      navigation.setOptions({
        title: 'Regiments Of Renown',
      });

      const _regimentsOfRenown = getRegimentsOfRenownForFaction(builder.selectedArmyList?.faction);

      setRegimentsOfRenown(_regimentsOfRenown);
    }
  }, [builder.selectedArmyList]);

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

  useEffect(() => {
    const data = getRegimentsOfRenownForFaction(builder.selectedArmyList?.faction);
    setRegimentsOfRenownDetails(data);
  }, []);

  const armyCount = useMemo(() => {
    return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
  }, [builder.calculateCurrentArmyPoints(), totalPoints]);

  const {
    getFactionUnitsByVersion,
    getRegimentsOfRenownForFaction,
    getRegimentsOfRenownFactionData,
  } = useFactionUnits();

  const handleViewPreview = (unitName: string) => {
    const rawUnitData = regimentsOfRenown?.find((x) => x.name == unitName);
    let _unit = Object.assign({}, rawUnitData);
    _unit.specialRules = [];
    if (_unit) {
      if (regimentsOfRenownDetails && _unit?.name) {
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

      setSelectedUnitDetails(_unit);
      setUnitPreviewVisible(true);
    } else {
      console.error(`UNIT NOT FOUND for ${unitName}`);
    }
  };

  const [toggleDescription, setToggleDescription] = useState(false);

  const handleToggleDescription = () => {
    setToggleDescription(!toggleDescription);
  };
  return (
    <MainContainerWithBlankBG>
      <ScrollView>
        <CollapsibleComponent
          headerLeftComponent={
            <View style={{ flex: 1 }}>
              <Text bold style={{ color: theme.textInverted }}>
                What are Regiments of Renown?
              </Text>
            </View>
          }
          collapsableContent={
            <View style={{ paddingVertical: 4, paddingTop: 12 }}>
              <Text italic style={{ color: theme.textInverted, marginBottom: 8 }}>
                There are many mercenaries around the Old World. They mostly recruit from outlaws,
                pirates and renegades as well as simple adventurers looking for a fight, wealth and
                fame. They gather in wandering bands, companies and even entire armies around a
                charismatic and usually infamous leader and look for an opportunity to fight...
                especially to fight for proper payment.
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                Regiments of Renown are elite, specialized, and often named units that stand out
                from standard troops due to superior stats or unique abilities. It is effectively a
                way of bringing non-faction models into a list.
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                It is effectively a way of bringing non-faction models into a list.
              </Text>
            </View>
          }
        />
        <CollapsibleComponent
          headerLeftComponent={
            <View style={{ flex: 1 }}>
              <Text bold style={{ color: theme.textInverted }}>
                Special Rules (pg. 84 WMR Armies)
              </Text>
            </View>
          }
          collapsableContent={
            <View style={{ paddingVertical: 4, paddingTop: 12 }}>
              <Text style={{ color: theme.textInverted, marginBottom: 8 }}>
                <Text style={{ color: theme.textInverted }} bold>
                  For hire.
                </Text>{' '}
                Mercenary units are very popular in the Old World. Each army list may add (hire) a
                maximum 1 Regiments of Renown unit for each full 1000 points of army value following
                the Allies Table. Hired units count towards the maximum allowance per 1000 points of
                the unit type indicated in the Hiring Regiments of Renown section.
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                <Text bold style={{ color: theme.textInverted }}>
                  Led by the Hero.
                </Text>{' '}
                To represent the presence of a strong leader, Regiments of Renown units (including
                artillery and heroes) type cost 10 points more than their equivalents in the
                standard armies (extra point value is included in Regiments of Renown unit profile).
                They also receive a +1 bonus to the combat Attack value of one stand. Note that this
                gives +1 Attack in total, not +1 to each stand! This extra attack is not included in
                the Army Selector profile.
                <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                  No magic item may be given to hired Regiments of Renown units nor heroes.
                </Text>
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                <Text bold style={{ color: theme.textInverted }}>
                  Independent and Exclusive.
                </Text>{' '}
                Mercenaries recruit from many races and lands of the Old World. Living in the Empire
                ‘humanized‘ them a lot, but they still stay individual. Therefore, they stay
                independent to any army and racial special rules - neither bonuses nor drawbacks.
                {''}
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                Hired units can be ordered and brigaded without penalties, just like the other units
                in your army. In case of a blunder make separate Blunder roll for Regiments of
                Renown units if they are brigaded with other troops. That means one roll for your
                army list troops and one roll for Regiments of Renown troops.
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                They may not be targeted by friendly Wizard‘s spells and do not receive any benefit
                from friendly spells or effects including area spells and effects.
              </Text>
              <Text style={{ color: theme.textInverted, marginTop: 4 }}>
                Additionally your army may contain only one of each unique listed unit. If your
                opponent hired the same regiment, just roll a dice and decide who got the
                ‘authentic‘ one and who the ‘impersonated‘ one. This roll is just for fun, without
                any impact in the game.
              </Text>
            </View>
          }
        />
        <View style={{ flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center' }}>
          <FontAwesome name="warning" size={18} color={theme.text} style={{ marginRight: 8 }} />
          <Text>{t('PlayersNeedToAgreeOnUsingRegimentsOfRenownMessage')}</Text>
        </View>
        <FlatList
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          scrollEnabled={false}
          data={regimentsOfRenown}
          renderItem={({ item, index }) => {
            // get unit count for this unit.
            const units = sectionListData?.find((x) => x.title == 'Units')?.data;
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
                isUnique
                onDeleteUnit={() => builder.removeUnit(_unit?.id)}
              />
            );
          }}
        />

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
                renderItem={(nestedItem) => {
                  return (
                    <View>
                      <Text style={{ color: theme.black }}>{nestedItem.item.error}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
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
        <RegimentsOfRenownPreview
          handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
          visible={unitPreviewVisible}
          selectedUnitDetails={selectedUnitDetails}
        />
      ) : null}
    </MainContainerWithBlankBG>
  );
};

export default AddRegimentsOfRenown;

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
