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
import { Button, StandardModal } from '@components/index';
import { useFactionListsV2 } from '@hooks/useFactionLists';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useBuilderV2Context } from '@context/v2/BuilderV2Context';
import { useFactionDataContext } from '@context/v2/FactionDataContext';
import ThemedButton from '@components/Button/ThemedButton';
import EditArmyV2 from './EditArmyV2';
import { ArmyEditorStackParamList } from '@navigation/Builder/CreateArmyStack/ArmyEditorStack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import AntDesign from '@expo/vector-icons/AntDesign';

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;
// type ArmyCreationV2Props = {
//   theme: Theme;
//   handleDismissModal: () => void;
// };
const ArmyCreationV2 = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  const builder = useBuilderContext();
  const { createUserArmyList, handleSetFocusedArmyByArmyId } = useBuilderV2Context();
  const { factionDetailsFromApi, setFaction } = useFactionDataContext();
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const toast = useToast();
  const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
  // form data
  const [factionNameError, setFactionNameError] = useState(false);
  const [factionName, setFactionName] = useState<string>('');

  const [factionSelection, setFactionSelection] = useState<number>();
  const [factionDescription, setFactionDescription] = useState([] as string[]);
  const [activeIndex, setActiveIndex] = useState(0);

  // all new stuff below
  const [selectedFactionId, setSelectedFactionId] = useState<Factions | undefined>(undefined);
  //   const { factionDetailsFromApi } = useFactionListsV2(selectedFactionId);

  const [showFactionSelection, setShowFactionSelection] = useState(true);
  const [showFactionEditDetails, setShowFactionEditDetails] = useState(false);

  const [formArmyName, setFormArmyName] = useState('');
  const [formArmyNotes, setFormArmyNotes] = useState('');

  const [formOneComplete, setFormOneComplete] = useState(false);
  const [formTwoComplete, setformTwoComplete] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);

  useEffect(() => {
    console.log('🚀 ~ ArmyCreationV2 ~ selectedFactionId:', selectedFactionId);
    setFaction(selectedFactionId);
    // console.log(builder.factionDetails, 'dfd');
  }, [selectedFactionId]);

  // faction selection
  const setCurrentActiveIndex = (index: number) => {
    console.log('🚀 ~ setCurrentActiveIndex ~ index:', index);
    if (index !== undefined) {
      setActiveIndex(index);
      // const x = ddFactions[index]?.value;

      // setFactionSelection(x as number);
    }
    if (index * (THUMBNAIL_WIDTH + 19 + SPACING) - (THUMBNAIL_WIDTH + 19) / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (THUMBNAIL_WIDTH + 19 + SPACING) - width / 2 + (THUMBNAIL_WIDTH + 18) / 2,
        // offset: index * (width / 2),
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  const { width, height } = Dimensions.get('screen');
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

  useEffect(() => {
    const { ddFactionList } = getFactionsDropdown();
    setDdFactions(ddFactionList);
  }, []);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ factionName:', factionName);
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
  }, [formArmyName, selectedFactionId]);
  const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
    if (formArmyName == '') {
      console.error('🚀 ~ onConfirmCreateArmyPress ~ factionName:', factionName);
      setFactionNameError(true);
    } else {
      setFactionNameError(false);
    }
    if (formOneComplete && formTwoComplete) {
      builder
        .addUserArmyList(factionSelection, formArmyName, autopopulate, CURRENT_VERSION)
        .then((result) => {
          builder.setSelectedArmyList(result);
        })
        .catch(() => {})
        .finally(() => {
          // navigation.navigate("BuilderEdit");
          handleDismiss();
          toast.show(`New army created!`);
        });
    }
  };

  const resetForm = () => {
    setFactionSelection(undefined);
    setFactionName('');
  };

  const handleDismiss = () => {
    resetForm();
    nav.goBack();
  };

  // SUBMISSION
  const handlePrimaryButtonPress = async () => {
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
      const newArmy = createUserArmyList(selectedFactionId, formArmyName, formArmyNotes, true, 0);
      setCreationLoading(true);
      // dddddddddddddddd
      handleSetFocusedArmyByArmyId(newArmy.armyId)
        .then((res) => {
          nav.navigate('BuilderEdit');
        })
        .catch((err) => {})
        .finally(() => {
          setCreationLoading(false);
        });
    }
  };

  const handleBack = () => {
    setShowFactionEditDetails(false);
    setShowFactionSelection(true);
  };
  const thumbRef = useRef<FlatList>(null);
  const nameRef = useRef<TextInput>(null);

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
    <View style={{ backgroundColor: theme.blueGrey, paddingHorizontal: 12, flex: 1 }}>
      {/* /Timeline.tsx */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          justifyContent: 'space-evenly',
        }}>
        {/*TimelineItem.tsx*/}
        <Pressable
          onPress={() => handleTimelinePress(0)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              <AntDesign
                name="check"
                size={14}
                color={showFactionSelection ? theme.textInverted : theme.text}
              />
            ) : (
              <ThemedText style={{ color: showFactionSelection ? theme.textInverted : theme.text }}>
                1
              </ThemedText>
            )}
          </View>
          <View style={{ paddingLeft: 8 }}>
            <ThemedText style={{ textAlign: 'center' }}>Select Faction</ThemedText>
          </View>
        </Pressable>
        {/*TimelineItem.tsx*/}
        <Pressable
          onPress={() => handleTimelinePress(1)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              <AntDesign
                name="check"
                size={14}
                color={showFactionEditDetails ? theme.textInverted : theme.text}
              />
            ) : (
              <ThemedText
                style={{ color: showFactionEditDetails ? theme.textInverted : theme.text }}>
                2
              </ThemedText>
            )}
          </View>
          <View style={{ paddingLeft: 8 }}>
            <ThemedText style={{ textAlign: 'center' }}>Edit Details</ThemedText>
          </View>
        </Pressable>
      </View>
      <View style={{ height: 70, marginVertical: 4 }}>
        {/* <Animated.View style={{ alignItems: 'center', height: 40 }} entering={FadeIn}>
              <ThemedText size="lg" bold>
                Select Faction
              </ThemedText>
            </Animated.View> */}
        <ImageBackground
          resizeMode="stretch"
          style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 10, height: 70 }}
          source={require('../../../../../../images/svgs/scroll_header.png')}>
          <ThemedText
            style={{
              zIndex: 999,
              textAlign: 'center',
              fontSize: 20,
              color: theme.textInverted,
            }}
            bold>
            {factionDetailsFromApi?.name}
          </ThemedText>
        </ImageBackground>
      </View>
      {showFactionSelection ? (
        <Animated.View
          entering={FadeInLeft.delay(200)}
          exiting={FadeOutRight}
          style={{ paddingVertical: 6 }}>
          <ScrollView
            onStartShouldSetResponder={() => true}
            // contentContainerStyle={{ height: 300 }}
            style={{
              height: Dimensions.get('screen').height / 2.5,
              maxHeight: Dimensions.get('screen').height / 2.5,
            }}
            scrollEnabled={true}>
            {factionDetailsFromApi == null && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ThemedText style={{ textAlign: 'center', fontSize: 20 }} bold>
                  Select a faction
                </ThemedText>
              </View>
            )}
            {factionDetailsFromApi?.description.map((item, index) => {
              return (
                <ThemedText style={{ textAlign: 'center', paddingBottom: 4 }}>{item}</ThemedText>
              );
            })}
          </ScrollView>
          <View style={{ marginTop: 12, flexGrow: 1 }}>
            <FlatList
              ref={thumbRef}
              horizontal
              data={ddFactions}
              // snapToInterval={width / 2 - THUMBNAIL_WIDTH + 5}
              contentContainerStyle={{
                paddingHorizontal: SPACING,
                paddingVertical: 4,
              }}
              renderItem={({ item, index }) => {
                const armyName = item.value ? getKeyByValue(Factions, item?.value as number) : '';

                const factionAssets = getLocalFactionAssets(armyName ? armyName : '');
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFactionId(item.value);
                      setCurrentActiveIndex(index);
                      setFormOneComplete(true);
                      console.log(item, 'ITddfdfEM');
                    }}
                    key={index}
                    style={{ overflow: 'hidden' }}>
                    <View
                      style={{
                        width: activeIndex == index ? THUMBNAIL_WIDTH + 5 : THUMBNAIL_WIDTH + 5,
                        height:
                          activeIndex == index ? THUMBNAIL_HEIGHT + 20 : THUMBNAIL_HEIGHT + 20,
                        backgroundColor: theme.background,
                        borderRadius: 8,
                        borderColor: activeIndex == index ? theme.warning : theme.background,
                        borderWidth: 2,
                        marginRight: SPACING,
                        overflow: 'hidden',
                      }}>
                      <Image
                        style={[
                          styles.stretch,
                          {
                            width: activeIndex == index ? THUMBNAIL_WIDTH + 5 : THUMBNAIL_WIDTH + 5,
                            height:
                              activeIndex == index ? THUMBNAIL_HEIGHT - 2 : THUMBNAIL_HEIGHT - 2,
                          },
                        ]}
                        source={factionAssets && factionAssets[0]}
                      />

                      <View
                        style={{
                          zIndex: 999,
                          backgroundColor: theme.white,
                          height: 20,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                        }}>
                        <ThemedText
                          bold
                          style={{
                            textAlign: 'center',
                            color: theme.textInverted,
                          }}>
                          {item.label}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }}></View>}
            />
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInLeft.delay(200)} exiting={FadeOutRight}>
          <EditArmyV2
            armyName={formArmyName}
            onArmyNameChange={setFormArmyName}
            armyNotes={formArmyNotes}
            onArmyNotesChange={setFormArmyNotes}
            theme={theme}
          />
        </Animated.View>
      )}
      <KeyboardAwareScrollView
        enabled={false}
        contentContainerStyle={{
          paddingTop: 16,
          flexDirection: 'column',
          flex: 1,
          minHeight: 150,
          justifyContent: 'flex-end',
          paddingBottom: x.bottom,
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

        <Button
          onPress={() => (showFactionEditDetails ? handleBack() : handleDismiss())}
          variant={'text'}>
          <ThemedText bold style={{ textTransform: 'uppercase', color: theme.white }}>
            {showFactionEditDetails ? 'Back' : 'Cancel'}
          </ThemedText>
        </Button>
      </KeyboardAwareScrollView>
      <StandardModal
        content={
          <View>
            <ThemedText>Creating Army</ThemedText>
          </View>
        }
        visible={creationLoading}
        heading={'Loading'}
        onCancel={function (): void {
          throw new Error('Function not implemented.');
        }}></StandardModal>
    </View>
  );
};

export default ArmyCreationV2;

const styles = StyleSheet.create({
  stretch: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT - 5,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});
