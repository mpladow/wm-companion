import { Button, Text } from '@components/index';
import { useBuilderContext } from '@context/BuilderContext';
import { useTheme } from '@hooks/useTheme';
import { DropDownItemProps } from '@navigation/Tracker/screens/Tracker';
import { useNavigation } from '@react-navigation/native';
import { Factions } from '@utils/constants';
import { getFactionsDropdown, getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import { useFactionUnits } from '@utils/useFactionUnits';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Dimensions,
	FlatList,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;
const CreateArmy = () => {
  const builder = useBuilderContext();
  const navigation = useNavigation();

  const { getFactionUnitsByVersion } = useFactionUnits();
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const toast = useToast();
  const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
  // form data
  const [factionNameError, setFactionNameError] = useState(false);
  const [factionName, setFactionName] = useState<string>('');

  const [factionSelection, setFactionSelection] = useState<number | string>();
  const [factionDescription, setFactionDescription] = useState([] as string[]);

  // faction selection
  const setCurrentActiveIndex = (index: number) => {
    if (index !== undefined) {
      setActiveIndex(index);
      const x = ddFactions[index]?.value;
      setFactionSelection(x as number);
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
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('screen');
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

  useEffect(() => {
    const { ddFactionList } = getFactionsDropdown();
    setDdFactions(ddFactionList);
  }, []);

  useEffect(() => {
    if (ddFactions.length > 0) {
      setCurrentActiveIndex(0);
    }
  }, [ddFactions]);
  useEffect(() => {
    // get factionDescription
    const factionunits = getFactionUnitsByVersion(factionSelection as number, CURRENT_VERSION);
    setFactionDescription(factionunits.description);
  }, [factionSelection]);
  useEffect(() => {
    if (factionName != '') setFactionNameError(false);
  }, [factionName]);

  const onNextStopPress = () => {
    if (factionSelection !== null) {
      navigation.navigate('EditArmy', {
        factionSelection: factionSelection,
      });
    }
  };

  const resetForm = () => {
    setFactionSelection(undefined);
    setFactionName('');
  };

  const thumbRef = useRef<FlatList>(null);
  const nameRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 12 }}>
      <View style={{ height: 70, marginVertical: 4, marginTop: 12 }}>
        <ImageBackground
          resizeMode="stretch"
          style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 10 }}
          source={require('../../images/svgs/scroll_header.png')}>
          <Text
            style={{
              zIndex: 999,
              textAlign: 'center',
              fontSize: 20,
              color: theme.textInverted,
            }}
            bold>
            {factionSelection && Factions[factionSelection]?.replaceAll('_', ' ')}
          </Text>
        </ImageBackground>
      </View>
      <ScrollView scrollEnabled={true}>
        {factionSelection == null && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }} bold>
              Select a faction
            </Text>
          </View>
        )}
        {factionDescription.map((item, index) => {
          return <Text style={{ textAlign: 'center', paddingBottom: 4 }}>{item}</Text>;
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
                onPress={() => setCurrentActiveIndex(index)}
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
                    <Text
                      bold
                      style={{
                        textAlign: 'center',
                        color: theme.textInverted,
                      }}>
                      {item.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }}></View>}
        />
      </View>
      <View style={{ paddingTop: 16, flexDirection: 'row', gap: 12 }}>
        {/* <Button onPress={() => onConfirmCreateArmyPress(true)} variant={'confirm'}>
          <Text bold style={{ textTransform: 'uppercase', color: theme.black }}>
            {t('Create', { ns: 'common' })}
          </Text>
        </Button> */}
        <View>
          <Button onPress={() => navigation.goBack()} variant={'text'}>
            <Text bold style={{ textTransform: 'uppercase', color: theme.white }}>
              Close
            </Text>
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={() => onNextStopPress()} variant={'secondary'}>
            <Text bold style={{ textTransform: 'uppercase', color: theme.white }}>
              Next
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateArmy;

const styles = StyleSheet.create({
  stretch: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT - 5,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});
