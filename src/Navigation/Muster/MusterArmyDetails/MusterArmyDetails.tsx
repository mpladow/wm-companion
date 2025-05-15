import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/state/state';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { useTheme } from '@hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { ArmySectionListDataV2Props } from '../components/ArmySectionListV2';
import MusterUnitCard from '../components/MusterUnitCard';
import MusterCharacterCard from '../components/MusterCharacterCard';

const MusterArmyDetails = () => {
  const userArmy = useSelector((state: RootState) => {
    return state.musteringArmy;
  });
  console.log('🚀 ~ handlePrimaryButtonPress userArmy ~ userArmy:', userArmy);
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* list all units */}
      {/* {builder.factionDetails?.armyRules ? (
        <SpecialRulesCollapsible
          toggleVisible={() => setShowFactionInfo(!showFactionInfo)}
          visible={!showFactionInfo}
          title={t('ArmySpecialRules')}
          contents={builder.factionDetails.armyRules}
        />
      ) : null} */}
      {/* Spell list, break point */}
      {/* <LinearGradient
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
        }}></LinearGradient> */}
      <View
        style={{
          zIndex: 9,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}>
        <View>{/* <Text style={{ fontSize: 16 }}>{builder.getUnitCounts()}</Text> */}</View>
        {/* <CustomCheckbox onValueChange={() => setShowStatlineSetting()} value={settings.showStatline} label={t('ShowStatline')} /> */}
        {/* <View>
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
        </View> */}
      </View>
      <FlatList
        data={userArmy.selectedCharacters}
        renderItem={({ item, index }) => {
          return (
            <MusterCharacterCard
              key={index.toString()}
              unit={item}
              onUnitCardPress={function (name: string): void {
                throw new Error('Function not implemented.');
              }}
            />
          );
        }}
      />
      <FlatList
        data={userArmy.selectedUnits}
        renderItem={({ item, index }) => {
          return (
            <MusterUnitCard
              key={index.toString()}
              totalForUnit={userArmy.selectedUnits.filter((x) => x.name == item.name)?.length}
              unit={item}
              onUnitCardPress={function (name: string): void {
                throw new Error('Function not implemented.');
              }}
            />
          );
        }}
      />

      {/* // points verification container */}
      <View style={{ zIndex: 9, position: 'absolute', bottom: 10, left: 20, flexDirection: 'row' }}>
        {/* TODO extract out  */}
        {/* <ArmyPointsCount
          armyErrorsCount={builder.armyErrors.length}
          setVisibility={(visibility) => setErrorsVisible(visibility)}
          armyCount={armyCount}
        /> */}
      </View>
      <View style={{ position: 'absolute', bottom: 10, right: 20, flexDirection: 'row' }}>{/* TODO extract out  */}</View>
      {/* {All selected upgrades modal} */}
      {/* <AllSelectedUpgradesModal
				setVisible={(vis) => setAllSelectedUpgradesVisible(vis)}
				visible={allSelectedUpgradesVisible}
				headerTitle={"Selected Upgrades"}
				upgrades={magicItems}
				selectedUpgrades={builder.selectedArmyList?.selectedUpgrades}
			/> */}
      {/* // add new new */}
      {/* <UpgradePreview
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
      </Modal> */}
    </SafeAreaView>
  );
};

export default MusterArmyDetails;

const styles = StyleSheet.create({});
