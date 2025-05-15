import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  Pressable,
  KeyboardAvoidingView,
  SafeAreaView,
  Modal,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Theme, useTheme } from '@hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { Factions } from '@utils/constants';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { Button, StandardModal } from '@components/index';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeOutRight } from 'react-native-reanimated';

import ThemedButton from '@components/Button/ThemedButton';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useBuilderV2Context } from '@context/BuilderV2Context';
import { useFactionDataContext } from '@context/FactionDataContext';
import FormSelectFaction from './FormScreens/FormSelectFaction';
import FormFactionDetails from './FormScreens/FormSetFactionDetails';
import { AppDispatch, RootState } from 'src/state/state';
import { useDispatch, useSelector } from 'react-redux';
import { addUserArmy } from 'src/state/userArmiesSlice';
import { ArmyListPersistenceType, CharacterPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';

import uuid from 'uuid-random';
import { setArmyToEdit } from 'src/state/musteringArmySlice';
import { ArmyListType, CharacterType } from 'src/types/models/types';
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
    if (formOneComplete && formTwoComplete && showFactionEditDetails) {
      setLoading(true);
      if (selectedFactionId) {
        const newUserArmy: ArmyListPersistenceType = {
          armyId: uuid(),
          faction: selectedFactionId,
          name: formArmyName,
          isFavourite: false,
          armyNotes: formArmyName,
          order: userArmies.length + 1,
          selectedUnits: [],
          selectedCharacters: [],
        };
        // add min units into userARmy
        const requiredCharacters = selectedFactionData?.characters.filter((x) => x.armyMin !== undefined);
        const requiredUnits = selectedFactionData?.units.filter((x) => x.min !== undefined);
        requiredCharacters?.forEach((rc) => {
          if (rc.armyMin)
            for (let index = 0; index < rc.armyMin; index++) {
              const newCharacter: CharacterPersistenceType = {
                id: uuid(),
                characterId: rc.id,
                name: rc.name,
                selectedUpgrades: [],
              };
              newUserArmy.selectedCharacters.push(newCharacter);
            }
        });
        requiredUnits?.forEach((rc) => {
          if (rc.min)
            for (let index = 0; index < rc.min; index++) {
              const newUnit: UnitPersistenceType = {
                id: uuid(),
                unitId: rc.id,
                name: rc.name,
                selectedUpgrades: [],
              };
              newUserArmy.selectedUnits.push(newUnit);
            }
        });
        console.log('🚀 ~ handlePrimaryButtonPress ~ newUserArmy:', newUserArmy);

        dispatch(addUserArmy(newUserArmy));
        setShowFactionSelection(true);
        setShowFactionSelection(false);

        // set data to army before navigating
        const armyToEdit: ArmyListType = {
          armyId: newUserArmy.armyId,
          faction: newUserArmy.faction,
          name: newUserArmy.name,
          isFavourite: newUserArmy.isFavourite,
          armyNotes: newUserArmy.armyNotes,
          order: newUserArmy.order,
          selectedUnits: requiredUnits ?? [],
          selectedCharacters: requiredCharacters ?? [],
          points: 0,
        };
        dispatch(setArmyToEdit(armyToEdit));

        setTimeout(() => {
          setLoading(false);
          nav.navigate('MusterArmyDetails');
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
            faction={selectedFactionData?.factionName ?? ''}
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
