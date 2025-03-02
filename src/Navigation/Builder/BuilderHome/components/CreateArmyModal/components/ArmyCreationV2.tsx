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
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Theme } from '@hooks/useTheme';
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
import { useFactionListsV2 } from '@hooks/useArmyList';
import Animated, { FadeInDown } from 'react-native-reanimated';

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;
type ArmyCreationV2Props = {
  theme: Theme;
  handleDismissModal: () => void;
};
const ArmyCreationV2 = ({ theme, handleDismissModal }: ArmyCreationV2Props) => {
  const builder = useBuilderContext();

  const { getFactionUnitsByVersion } = useFactionUnits();
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const toast = useToast();
  const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
  // form data
  const [factionNameError, setFactionNameError] = useState(false);
  const [factionName, setFactionName] = useState<string>('');

  const [factionSelection, setFactionSelection] = useState<number>();
  const [factionDescription, setFactionDescription] = useState([] as string[]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedFactionId, setSelectedFactionId] = useState<Factions | undefined>(undefined);
  const { factionDetailsFromApi } = useFactionListsV2(selectedFactionId);

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
    // get factionDescription
    const factionunits = getFactionUnitsByVersion(factionSelection as number, CURRENT_VERSION);
    setFactionDescription(factionunits.description);
  }, [factionSelection]);
  useEffect(() => {
    if (factionName != '') setFactionNameError(false);
  }, [factionName]);

  const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
    if (factionName == '') {
      console.error('🚀 ~ onConfirmCreateArmyPress ~ factionName:', factionName);
      setFactionNameError(true);
    } else {
      setFactionNameError(false);
    }
    if (factionSelection && factionName != '') {
      builder
        .addUserArmyList(factionSelection, factionName, autopopulate, CURRENT_VERSION)
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
    handleDismissModal();
  };

  const thumbRef = useRef<FlatList>(null);
  const nameRef = useRef<TextInput>(null);

  return (
    <>
      <View style={{ height: 70, marginVertical: 4 }}>
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
      <ScrollView
        onStartShouldSetResponder={() => true}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}>
        {factionDetailsFromApi == null && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ThemedText style={{ textAlign: 'center', fontSize: 20 }} bold>
              Select a faction
            </ThemedText>
          </View>
        )}
        {factionDetailsFromApi?.description.map((item, index) => {
          return <ThemedText style={{ textAlign: 'center', paddingBottom: 4 }}>{item}</ThemedText>;
        })}
      </ScrollView>
      <View style={{ marginTop: 12 }}>
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
                  setCurrentActiveIndex(index);
                  setSelectedFactionId(item.value);
                  console.log(item, 'ITEM');
                }}
                key={index}
                style={{ overflow: 'hidden' }}>
                <View
                  style={{
                    width: activeIndex == index ? THUMBNAIL_WIDTH + 5 : THUMBNAIL_WIDTH + 5,
                    height: activeIndex == index ? THUMBNAIL_HEIGHT + 20 : THUMBNAIL_HEIGHT + 20,
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
                        height: activeIndex == index ? THUMBNAIL_HEIGHT - 2 : THUMBNAIL_HEIGHT - 2,
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
      <View style={{ paddingTop: 16, flexDirection: 'column' }}>
        <Button onPress={() => onConfirmCreateArmyPress(true)} variant={'confirm'}>
          <ThemedText bold style={{ textTransform: 'uppercase', color: theme.black }}>
            {t('Create', { ns: 'common' })}
          </ThemedText>
        </Button>
        <Button onPress={() => handleDismiss()} variant={'text'}>
          <ThemedText bold style={{ textTransform: 'uppercase', color: theme.white }}>
            {t('Cancel', { ns: 'common' })}
          </ThemedText>
        </Button>
      </View>
    </>
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
