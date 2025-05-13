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
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Theme, useTheme } from '@hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useBuilderContext } from '@context/BuilderContext';
import { useToast } from 'react-native-toast-notifications';
import { useFactionUnits } from '@utils/useFactionUnits';
import { DropDownItemProps } from '@navigation/Tracker/screens/Tracker';
import { getFactionsDropdown, getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import Constants from 'expo-constants';
import { Factions } from '@utils/constants';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { Button } from '@components/index';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeOutRight } from 'react-native-reanimated';

import ThemedButton from '@components/Button/ThemedButton';
import { ArmyEditorStackParamList } from '@navigation/Builder/CreateArmyStack/ArmyEditorStack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useBuilderV2Context } from '@context/BuilderV2Context';
import { useFactionDataContext } from '@context/FactionDataContext';
import FormSelectFaction from './FormScreens/FormSelectFaction';
import FormFactionDetails from './FormScreens/FormSetFactionDetails';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

// type ArmyCreationV2Props = {
//   theme: Theme;
//   handleDismissModal: () => void;
// };
const ArmyCreationForm = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  const builder = useBuilderContext();
  const { createUserArmyList } = useBuilderV2Context();
  const { allFactionData, setSelectedFactionByFactionId, selectedFactionData } = useFactionDataContext();
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
    createUserArmyList;
  };

  const handleBack = () => {
    setShowFactionEditDetails(false);
    setShowFactionSelection(true);
  };

  const x = useSafeAreaInsets();

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
    </SafeAreaView>
  );
};

export default ArmyCreationForm;
