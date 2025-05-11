import { Animated, Pressable, SectionList, View } from 'react-native';
import { ArmyListFilters, ArmyListProps, ListSections } from '@context/BuilderContext';
import { useTheme } from '@hooks/useTheme';
import ArmyListCard from '@navigation/Builder/components/ArmyListCard';
import { Button, StandardModal, Text, TextBlock } from '@components/index';
import React, { useRef, useState } from 'react';
import Constants from 'expo-constants';
import CustomText from '@components/CustomText';
import { useToast } from 'react-native-toast-notifications';
import LogoWmr from '@components/SVGS/LogoWmr';
import { useTranslation } from 'react-i18next';
import ArmyListFilter from './ArmyListFilter';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AnimatedHeader, { AppHeader } from '@components/AnimatedHeader/AnimatedHeader';
import { HEADER_HEIGHT } from 'src/constants/styling';
import { FadeInRight } from 'react-native-reanimated';
import { ArmyListPersistenceType } from 'src/types/models/persistence';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import ArmyListCardV2, { ArmyListVM } from '@navigation/Builder/components/ArmyListCardV2';

export type armySectionListDataProps = {
  title: string;
  data: ArmyListVM[];
};

const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 0;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export type ArmySectionListV2Props = {
  sectionListData: armySectionListDataProps[];
  handleShowArmyNotesModal: (armyId: string) => void;
  onDuplicateArmyPress: (armyId: string) => void;
  onArmyListPress: (armyId: string) => void;
  onArmyListDeletePress: (armyId: string) => void;
  handleEditArmyPress: (armyId: string) => void;
  handleToggleFavourite: (armyId: string) => void;
  //   handleMigrateArmy: (armyId: string, versionNumber: number) => void;
  //   handleFilterChange: (filter: ArmyListFilters, section: ListSections) => void;
  //   favouritesFilters: ArmyListFilters[];
  //   mainFilters: ArmyListFilters[];
};
const ArmySectionListV2 = ({
  sectionListData,
  handleShowArmyNotesModal,
  onDuplicateArmyPress,
  onArmyListPress,
  onArmyListDeletePress,
  handleEditArmyPress,
  handleToggleFavourite,
}: ArmySectionListV2Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['builder', 'common', 'forms']);

  // filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [focusedFilters, setFocusedFilters] = useState<'favourites' | 'main'>();
  const DynamicHeader = ({ value }: any) => {
    const animatedHeaderHeight = value.interpolate({
      inputRange: [0, SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const animatedOpacity = value.interpolate({
      inputRange: [0, SCROLL_DISTANCE],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[{ height: animatedHeaderHeight, opacity: animatedOpacity }]}>
        <>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <LogoWmr height={80} width={200} />
            <View style={{ marginTop: -12 }}>
              <Text variant="heading3" style={{ fontSize: 24 }}>
                {t('Builder', { ns: 'common' })}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginTop: 12 }}>
              {/* <Text variant="heading2" style={{ textAlign: 'center', fontSize: 16 }}>
                {sectionListData[0]?.data?.length + sectionListData[1]?.data?.length} armies
              </Text> */}
            </View>
            {/* <View style={{ height: 50, width: 50 }}>
							<IconButton
								onPress={() => console.log("Show filters")}
								variant={"danger"}
								title={""}
								icon={<FontAwesome name='filter' size={24} color='black' />}
							/>
						</View> */}
          </View>
        </>
      </Animated.View>
    );
  };

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  return (
    <View style={{ zIndex: 999, flex: 1, padding: 16, paddingTop: HEADER_HEIGHT }}>
      <DynamicHeader value={scrollOffsetY} />
      <SectionList
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollOffsetY } },
            },
          ],
          { useNativeDriver: false },
        )}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        scrollEventThrottle={0}
        style={{ zIndex: 9, marginBottom: 80 }}
        stickySectionHeadersEnabled
        ListFooterComponent={() => <View style={{ padding: 40 }}></View>}
        sections={sectionListData}
        renderSectionHeader={({ section: { title } }) => (
          <View
            key={title}
            style={{
              alignItems: 'center',
              padding: 12,
              backgroundColor: theme.backgroundVariant2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text variant="heading3" style={{ fontSize: 20, textTransform: 'uppercase' }}>
              {title}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 8, backgroundColor: 'transparent' }}></View>
        )}
        renderItem={({ item, index }) => {
          return (
            <ArmyListCardV2
              armyList={item}
              handleOpenArmyNotes={(armyId) => handleShowArmyNotesModal(armyId)}
              handleDuplicateArmyPress={onDuplicateArmyPress}
              handleArmyListPress={() => onArmyListPress(item.armyId)}
              handleDeleteArmyPress={() => onArmyListDeletePress(item.armyId)}
              handleArmyNameChange={handleEditArmyPress}
              handleToggleFavourite={(armyId) => handleToggleFavourite(armyId)}
            />
          );
        }}
      />
    </View>
  );
};
export default ArmySectionListV2;
