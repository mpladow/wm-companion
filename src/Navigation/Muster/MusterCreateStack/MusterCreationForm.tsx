import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { Button, StandardModal } from '@components/index';
import { useTheme } from '@hooks/useTheme';
import { Factions } from '@utils/constants';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useToast } from 'react-native-toast-notifications';

import ThemedButton from '@components/Button/ThemedButton';
import { useBuilderV2Context } from '@context/BuilderV2Context';
import { useFactionDataContext } from '@context/FactionDataContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/state/state';
import { addUserArmy } from 'src/state/userArmiesSlice';
import FormSelectFaction from './FormScreens/FormSelectFaction';
import FormFactionDetails from './FormScreens/FormSetFactionDetails';

import { setArmyToEdit } from 'src/state/musteringArmySlice';
import { ArmyListType } from 'src/types/models/types';
import { PersistenceUnitCard, UserList } from 'src/types/modelsv2/persistence/userlist';
import uuid from 'uuid-random';
// type ArmyCreationV2Props = {
//   theme: Theme;
//   handleDismissModal: () => void;
// };
const ArmyCreationForm = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { createUserArmyList } = useBuilderV2Context();
  const { allFactionData, setSelectedFactionByFactionId, selectedFactionData } = useFactionDataContext();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const userArmies = useSelector((state: RootState) => {
    return state.userArmies;
  });

  const { t } = useTranslation(['builder', 'common', 'forms']);
  const toast = useToast();

  // all new stuff below
  //   const { factionDetailsFromApi } = useFactionListsV2(selectedFactionId);

  const [showFactionSelection, setShowFactionSelection] = useState(true);
  const [showFactionEditDetails, setShowFactionEditDetails] = useState(false);
  // FORM
  const [selectedFactionId, setSelectedFactionId] = useState<Factions | undefined>(undefined);

  const [formArmyName, setFormArmyName] = useState('');
  const [formArmyNameError, setFormArmyNameError] = useState('');
  const [formArmyNotes, setFormArmyNotes] = useState('');
  const [formArmyNotesError, setFormArmyNotesError] = useState('');

  const [formArmyPoints, setFormArmyPoints] = useState(2000);
  const [formArmyPointsBuffer, setFormArmyPointsBuffer] = useState(5);

  const [formOneComplete, setFormOneComplete] = useState(false);
  const [formTwoComplete, setformTwoComplete] = useState(false);

  const handleSetFaction = (factionId: number, factionName: string) => {
    console.log('🚀 ~ handleSetFaction ~ factionId:', factionId);
    setSelectedFactionByFactionId(factionId);
    setSelectedFactionId(factionId);
    setFormOneComplete(true);
    setFormArmyName(`New Army of ${factionName}`);
  };

  useEffect(() => {
    if (formArmyName != '') setFormArmyNameError('');
  }, [formArmyName]);

  useEffect(() => {
    validateForm();
  }, [formArmyName, selectedFactionId, formArmyPoints, formArmyPointsBuffer]);

  const validateForm = () => {
    if (formArmyName == '') {
      setformTwoComplete(false);
    } else {
      setformTwoComplete(true);
    }
    if (selectedFactionId) {
      setFormOneComplete(true);
    } else {
      setFormOneComplete(false);
    }
    if (formArmyPoints == null || formArmyPointsBuffer == null) {
      setformTwoComplete(false);
    } else {
      setformTwoComplete(true);
    }
  };

  const resetForm = () => {
    //  setFactionSelection(undefined);
    //  setFactionName('');
  };

  const handleDismiss = () => {
    resetForm();
    nav.goBack();
  };

  // SUBMISSION
  const handlePrimaryButtonPress = () => {
    if (showFactionSelection && selectedFactionId !== null) {
      setShowFactionEditDetails(true);
      setShowFactionSelection(false);
    }
    if (!formOneComplete) {
      setShowFactionSelection(true);
      setShowFactionEditDetails(false);
    }
    if (formTwoComplete) {
      setShowFactionEditDetails(true);
      setShowFactionSelection(false);
    }
    if (formOneComplete && formTwoComplete) {
      console.log('🚀 ~ CREATING ARMY ~ selectedFactionId:', selectedFactionId);
      // createUserArmyList(selectedFactionId, formArmyName, formArmyNotes, true, 0);
    }
    // CREATE NEW ARMY AND THEN NAVIGATE TO THE MUSTER EDIT SCREEN WITH THE NEW ARMY LOADED IN
    if (formOneComplete && formTwoComplete && showFactionEditDetails) {
      setLoading(true);
      if (selectedFactionId) {
        const newUserArmy: UserList = {
          UserListId: uuid(),
          FactionId: selectedFactionId,
          Name: formArmyName,
          IsFavourite: false,
          Notes: formArmyNotes,
          Order: userArmies.length + 1,
          UnitCards: [],
          VersionNumber: 1,
          CreatedAt: new Date(),
        };

        // add min units into userARmy
        const requiredCharacters = selectedFactionData?.characterCards.filter((x) => x.armyMin !== undefined);
        requiredCharacters?.forEach((rc) => {
          if (rc.armyMin)
            for (let index = 0; index < rc.armyMin; index++) {
              const newCharacter: PersistenceUnitCard = {
                PersistenceUnitCardId: uuid(),
                UnitId: rc.id,
                UpgradeIds: [],
                CreatedAt: new Date(),
              };
              newUserArmy.UnitCards.push(newCharacter);
            }
        });

        // add required units, where there is a min
        const requiredUnits = selectedFactionData?.troopCards.filter((x) => x.min !== undefined);
        requiredUnits?.forEach((rc) => {
          if (rc.min)
            for (let index = 0; index < rc.min; index++) {
              const newUnit: PersistenceUnitCard = {
                PersistenceUnitCardId: uuid(),
                UnitId: rc.id,
                UpgradeIds: [],
                CreatedAt: new Date(),
              };
              newUserArmy.UnitCards.push(newUnit);
            }
        });
        console.log('🚀 ~ handlePrimaryButtonPress ~ newUserArmy:', newUserArmy);

        dispatch(addUserArmy(newUserArmy));
        setShowFactionSelection(true);
        setShowFactionSelection(false);

        // set data to army before navigating - this needs to be transformed into the ArmyListType that MusterArmyDetails is expecting
        const armyToEdit: ArmyListType = {
          armyId: newUserArmy.UserListId,
          faction: newUserArmy.FactionId,
          name: newUserArmy.Name,
          isFavourite: newUserArmy.IsFavourite,
          armyNotes: newUserArmy.Notes,
          order: newUserArmy.Order,
          selectedUnits: requiredUnits ?? [],
          selectedCharacters: requiredCharacters ?? [],
          points: 0,
        };
        dispatch(setArmyToEdit(armyToEdit));

        setTimeout(() => {
          setLoading(false);
          nav.navigate('MusterArmyDetails' as never);
        }, 500);
      }
    }
  };

  const handleBack = () => {
    setShowFactionEditDetails(false);
    setShowFactionSelection(true);
  };

  const handleTimelinePress = (index: number) => {
    if (index == 0) {
      setShowFactionSelection(true);
      setShowFactionEditDetails(false);
    }
    if (index == 1) {
      setShowFactionSelection(false);
      setShowFactionEditDetails(true);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: theme.backgroundVariant }}>
      <View style={{ backgroundColor: theme.blueGrey, paddingHorizontal: 12 }}>
        {/* /Timeline.tsx */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            justifyContent: 'space-evenly',
          }}>
          {/*TimelineItem.tsx*/}
          <Pressable onPress={() => handleTimelinePress(0)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }} hitSlop={20}>
            {/* //circle.tsx */}
            <View
              style={{
                borderRadius: 50,
                backgroundColor: showFactionSelection ? theme.accent : 'transparent',
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {formOneComplete ? (
                <AntDesign name="check" size={14} color={showFactionSelection ? theme.textInverted : theme.text} />
              ) : (
                <ThemedText style={{ color: showFactionSelection ? theme.textInverted : theme.text }}>1</ThemedText>
              )}
            </View>
            <View style={{ paddingLeft: 8 }}>
              <ThemedText style={{ textAlign: 'center' }}>Select Faction</ThemedText>
            </View>
          </Pressable>
          {/*TimelineItem.tsx*/}
          <Pressable onPress={() => handleTimelinePress(1)} style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={20}>
            {/* //circle.tsx */}
            <View
              style={{
                borderRadius: 50,
                backgroundColor: showFactionEditDetails ? theme.accent : 'transparent',
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {formTwoComplete ? (
                <AntDesign name="check" size={14} color={showFactionEditDetails ? theme.textInverted : theme.text} />
              ) : (
                <ThemedText style={{ color: showFactionEditDetails ? theme.textInverted : theme.text }}>2</ThemedText>
              )}
            </View>
            <View style={{ paddingLeft: 8 }}>
              <ThemedText style={{ textAlign: 'center' }}>Edit Details</ThemedText>
            </View>
          </Pressable>
        </View>

        {showFactionSelection ? (
          <FormSelectFaction onSelectFaction={handleSetFaction} selectedFactionId={selectedFactionId} />
        ) : (
          <FormFactionDetails
            armyName={formArmyName}
            faction={selectedFactionData?.name ?? ''}
            onArmyNameChange={setFormArmyName}
            armyNotes={formArmyNotes}
            onArmyNotesChange={setFormArmyNotes}
            maxPoints={formArmyPoints}
            onMaxPointsChange={setFormArmyPoints}
            armyPointsBuffer={formArmyPointsBuffer}
            onArmyPointsBufferChange={setFormArmyPointsBuffer}
          />
        )}
        <View
          style={{
            paddingTop: 16,
            // flexDirection: 'column',
            // flex: 1,
            // minHeight: 150,
            justifyContent: 'flex-end',
            // paddingBottom: x.bottom,
            flexGrow: 1,
            height: 150,
          }}>
          {selectedFactionId && (
            <Animated.View entering={FadeIn}>
              <ThemedButton
                onPress={handlePrimaryButtonPress}
                buttonType="primary"
                variant={showFactionSelection ? 'ghost' : 'filled'}
                buttonSize={'default'}>
                {showFactionSelection ? 'Next: Army Name' : 'Create Army'}
                {/* <ThemedText bold style={{ textTransform: 'uppercase', color: theme.black }}>
              </ThemedText> */}
              </ThemedButton>
            </Animated.View>
          )}

          <Button onPress={() => (showFactionEditDetails ? handleBack() : handleDismiss())} variant={'text'}>
            <ThemedText bold style={{ textTransform: 'uppercase', color: theme.white }}>
              {showFactionEditDetails ? 'Back' : 'Cancel'}
            </ThemedText>
          </Button>
        </View>
      </View>
      <StandardModal
        visible={loading}
        content={
          <View>
            <ThemedText>Loading...</ThemedText>
          </View>
        }
        heading={'Creating Army...'}
        onCancel={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </SafeAreaView>
  );
};

export default ArmyCreationForm;
