import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { useFactionDataContext } from '@context/FactionDataContext';
import { useTheme } from '@hooks/useTheme';
import { DropDownItemProps } from '@navigation/Tracker/screens/Tracker';
import { getLocalFactionAssets } from '@utils/factionHelpers';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

type FormSelectFactionType = {
  onSelectFaction: (factionId: number, factionName: string) => void;
  selectedFactionId?: number;
};

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;
const FormSelectFaction = ({ onSelectFaction, selectedFactionId }: FormSelectFactionType) => {
  const thumbRef = useRef<FlatList>(null);
  const nameRef = useRef<TextInput>(null);
  const { width, height } = Dimensions.get('screen');
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);

  const { allFactionData, setSelectedFactionByFactionId, selectedFactionData } = useFactionDataContext();
  useEffect(() => {
    //  const { ddFactionList } = getFactionsDropdown();
    const factionDropDown = allFactionData
      .sort((x, y) => x.name.localeCompare(y.name, undefined, { sensitivity: 'base' }))
      .map((x) => {
        return { label: x.name, value: x.id } as DropDownItemProps;
      });
    setDdFactions(factionDropDown);
  }, []);

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

  useEffect(() => {
    console.log('🚀 ~ useFocusEffect ~ selectedFactionId:', selectedFactionId);
    if (selectedFactionId) {
      console.log('🚀 ~ testing active index active indexocusEffect ~ ddFactions:', ddFactions);
      const index = ddFactions.findIndex((f) => f.value == selectedFactionId);
      console.log('🚀 ~ testing active index ~ index:', index);
      if (index !== -1) {
        setCurrentActiveIndex(index);
      }
    }
  }, [selectedFactionId]);

  return (
    <Animated.View entering={FadeInLeft.delay(200)} exiting={FadeOutRight} style={{ paddingVertical: 6, flexGrow: 1 }}>
      <View>
        <View>
          <View style={{ height: 70, marginVertical: 4 }}>
            {/* <Animated.View style={{ alignItems: 'center', height: 40 }} entering={FadeIn}>
				  <ThemedText size="lg" bold>
					 Select Faction
				  </ThemedText>
				</Animated.View> */}
            <ImageBackground
              resizeMode="stretch"
              style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 10, height: 70 }}
              source={require('../../../../images/svgs/scroll_header.png')}>
              <ThemedText
                style={{
                  zIndex: 999,
                  textAlign: 'center',
                  fontSize: 20,
                  color: theme.textInverted,
                }}
                bold>
                {selectedFactionData?.name}
              </ThemedText>
            </ImageBackground>
          </View>
        </View>

        <View style={{ flexGrow: 1 }}>
          <ScrollView
            onStartShouldSetResponder={() => true}
            // contentContainerStyle={{ height: 300 }}
            style={{
              height: Dimensions.get('screen').height / 3,
              maxHeight: Dimensions.get('screen').height / 3,
            }}
            scrollEnabled={true}>
            {selectedFactionData == null && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ThemedText style={{ textAlign: 'center', fontSize: 20 }} bold>
                  Select a faction
                </ThemedText>
              </View>
            )}
            {selectedFactionData?.description.map((item, index) => {
              return <ThemedText style={{ textAlign: 'center', paddingBottom: 4 }}>{item}</ThemedText>;
            })}
          </ScrollView>
        </View>
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
              // const armyName = item.value ? getKeyByValue(Factions, item?.value as number) : '';

              const factionAssets = getLocalFactionAssets(item.label);
              return (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentActiveIndex(index);
                    onSelectFaction(item.value, item.label);
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
      </View>
    </Animated.View>
  );
};

export default FormSelectFaction;

const styles = StyleSheet.create({
  stretch: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT - 5,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});
