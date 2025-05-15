import { Dimensions, FlatList, ImageBackground, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { StandardModal, Text, TextBlock } from '@components/index';
import { ArmyListFilters, ArmyListProps, ListSections, useBuilderContext } from '@context/BuilderContext';
import fonts from '@utils/fonts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PopupConfirm from '@components/PopupConfirm';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import { useUpdateChecker } from '@context/UpdateCheckerContext';
import ArmySectionList, { armySectionListDataProps } from '@navigation/Builder/BuilderHome/components/ArmySectionList';
import AddArmyButton from '@navigation/Builder/BuilderHome/components/AddArmyButton';
import ThemedButton from '@components/Button/ThemedButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/state/state';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import ArmySectionListV2, { ArmySectionListDataV2Props } from './components/ArmySectionListV2';
import { UserArmiesDto } from 'src/types/models/viewModel';
import { Factions } from '@utils/constants';
import { setArmyToEdit } from 'src/state/musteringArmySlice';
import { ArmyListType } from 'src/types/models/types';
import { useFactionDataContext } from '@context/FactionDataContext';
import { useMuster } from '@hooks/useMuster';

const MusterUserArmies = () => {
  const [showCreateArmy, setShowCreateArmy] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [focusedArmyId, setFocusedArmyId] = useState<string>();
  const [focusedArmy, setFocusedArmy] = useState<ArmyListProps>();
  const [showArmyNotes, setShowArmyNotes] = useState(false);
  const [sectionListData, setSectionListData] = useState<ArmySectionListDataV2Props[]>([]);

  const [filterFavourites, setFilterFavourites] = useState<ArmyListFilters[]>(['all'] as ArmyListFilters[]);
  const [filterMain, setFilterMain] = useState<ArmyListFilters[]>(['all'] as ArmyListFilters[]);

  const { theme } = useTheme();
  const navigation = useNavigation();
  const builder = useBuilderContext();
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const toast = useToast();
  const userArmies = useSelector((state: RootState) => {
    //TODO
    state.userArmies.map((ua) => {
      // map to a view model
      const vm: UserArmiesDto = {
        name: ua.name,
        isFavourite: ua.isFavourite,
        factionName: ua.faction.toString(),
        points: '0',
        image: '',
      };
    });
    return state.userArmies;
  });
  const { setSelectedFactionByFactionId } = useFactionDataContext();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const favourited = userArmies.filter((x) => x.isFavourite);
    const notFavourited = userArmies.filter((x) => !x.isFavourite);
    const sLData: ArmySectionListDataV2Props = {
      data: favourited,
      title: 'Favourited',
    };
    const notFavouritedSLData: ArmySectionListDataV2Props = {
      data: notFavourited,
      title: 'Armies',
    };
    const arr: ArmySectionListDataV2Props[] = [];
    arr.push(sLData);
    arr.push(notFavouritedSLData);
    setSectionListData(arr);
  }, [userArmies]);

  const handleShowArmyNotesModal = (armyId: string) => {
    setFocusedArmy(builder.getArmyByArmyId(armyId));
    setShowArmyNotes(true);
  };
  const handleDismissArmyCreateModal = () => {
    setShowCreateArmy(false);
    setFocusedArmy(undefined);
  };
  //   const handleAddArmyPress = () => {
  //     setShowCreateArmy(true);
  //   };
  const handleEditArmyPress = (armyId: string) => {
    setFocusedArmy(builder.getArmyByArmyId(armyId));
    setShowCreateArmy(!showCreateArmy);
  };

  const { isReady, changelog, dismissChangeLog, recentlyDismissedChangeLog } = useUpdateChecker();
  const [showChangeLogModal, setShowChangeLogModal] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (changelog && recentlyDismissedChangeLog) {
        if (changelog.version !== recentlyDismissedChangeLog) {
          setShowChangeLogModal(true);
        } else {
          setShowChangeLogModal(false);
        }
      }
      if (changelog && !recentlyDismissedChangeLog) {
        setShowChangeLogModal(true);
      }
    }, 1200);
  }, [isReady]);
  const handleDismissModal = () => {
    dismissChangeLog();
    setShowChangeLogModal(false);
  };

  // const handleFilterFavouritesChange = (newFilter: ArmyListFilters) => {
  // 	setFilterFavourites([...filterFavourites, newFilter]);
  // };
  const handleFilterChange = (newFilter: ArmyListFilters, section: ListSections) => {
    console.log('🚀 ~ handleFilterChange ~ section:', section);
    if (section == 'main') {
      setFilterMain((filters) => {
        if (filters.find((x) => x == newFilter)) {
          return filters.filter((x) => x !== newFilter);
        } else {
          return [...filters, newFilter];
        }
      });
    } else {
      console.log('setting filters');
      setFilterFavourites((filters) => {
        if (filters.find((x) => x == newFilter)) {
          return filters.filter((x) => x !== newFilter);
        } else {
          return [...filters, newFilter];
        }
      });
    }
  };

  const generateContent = () => {
    return (
      <ScrollView>
        {changelog?.changes.map((x) => {
          let fontStyle: { color: string; fontSize: number } = { color: theme.text, fontSize: 16 };

          switch (x.type) {
            case 'overhaul':
              fontStyle.color = theme.accent;
              fontStyle.fontSize = 18;
              break;
            case 'bug':
              fontStyle.fontSize = 16;
              break;
            default:
              break;
          }
          return (
            <TextBlock variant="medium">
              <Text variant="heading3" style={{ fontSize: fontStyle.fontSize, color: fontStyle.color }}>
                {x.title}
              </Text>
              {x.description && x.description?.map((d) => <Text>{d}</Text>)}
            </TextBlock>
          );
        })}
      </ScrollView>
    );
  };

  const handleAddArmyPress = useCallback(() => {
    console.log('ADD');
    //  ref.current?.present();
    navigation.navigate('MusterCreateStack');
  }, []);
  const muster = useMuster();

  /**
   * on list item press, this will convert the persistence model into the working model
   * @param armyId
   */
  const handleArmyListItemPress = (armyId: string) => {
    const armyToEdit = userArmies.find((x) => x.armyId == armyId);
    if (armyToEdit) {
      const armyVm = muster.convertFromArmyPersistenceToViewModel(armyToEdit);
      console.log("🚀 ~ handleArmyListItemPress ~ armyVm:", armyVm)
      setSelectedFactionByFactionId(armyToEdit.faction);
      dispatch(setArmyToEdit(armyVm));
      navigation.navigate('MusterArmyDetails');
    }
  };
  const handleDuplicateArmyPress = () => {};
  const handleArmyDeletePress = () => {};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* <ImageBackground source={require('../../../../../assets/images/wmr_bg.png')} resizeMode="cover" style={[styles.image]}> */}
      <LinearGradient
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
        }}
      />
      <ArmySectionListV2
        handleFilterChange={handleFilterChange}
        sectionListData={sectionListData}
        handleShowArmyNotesModal={handleShowArmyNotesModal}
        onDuplicateArmyPress={handleDuplicateArmyPress}
        onArmyListPress={handleArmyListItemPress}
        onArmyListDeletePress={handleArmyDeletePress}
        handleEditArmyPress={handleEditArmyPress}
        handleToggleFavourite={builder.toggleFavourite}
        handleMigrateArmy={builder.migrateArmyList}
        favouritesFilters={filterFavourites}
        mainFilters={filterMain}
      />
      <PopupConfirm
        visible={confirmDialog}
        onConfirm={() => {
          focusedArmyId && builder.deleteUserArmyList(focusedArmyId);
          setConfirmDialog(false);
        }}
        onCancel={() => {
          setFocusedArmy(undefined);
          setConfirmDialog(false);
        }}
        text={<Text style={{ color: theme.text, fontSize: 16 }}>Do you want to delete this army?</Text>}
        confirmText={t('DeleteArmy', { ns: 'builder' })}
        cancelText={t('Cancel', { ns: 'common' })}
        headerText={t('DeleteArmy', { ns: 'builder' })}
      />
      {/* </ImageBackground> */}
      <View style={{ zIndex: 99999, position: 'absolute', bottom: 30, right: 24 }}>
        <ThemedButton onPress={handleAddArmyPress} buttonType={'primary'} variant={'filled'} buttonSize={'default'}>
          {t('AddArmy')}
        </ThemedButton>
      </View>
      {/* <AddArmyButton onAddArmyPress={handleAddArmyPress} theme={theme} buttonName={t('AddArmy')} /> */}
      {/* Army Notes MOdal */}
      <StandardModal
        visible={showArmyNotes}
        content={
          <View style={{ flex: 1 }}>
            <TextInput
              multiline
              value={focusedArmy?.armyNotes}
              maxLength={10}
              // onChangeText={(val) => setFactionNotes(val)}
              style={[
                {
                  color: theme.text,
                  fontFamily: fonts.PTSansRegular,
                  fontSize: 16,
                  borderRadius: 16,
                  paddingTop: 16,
                  height: 100,
                },
                // factionNameError && { borderColor: theme.danger, borderWidth: 4 },
              ]}
            />
          </View>
        }
        heading={t('ArmyNotes', { ns: 'builder' })}
        onCancel={() => setShowArmyNotes(false)}
      />
      <StandardModal
        content={generateContent()}
        heading={changelog ? `Changelog v${changelog?.version}` : "If you're seeing this, please report a bug :)"}
        onCancel={handleDismissModal}
        visible={showChangeLogModal}
        onSubmit={handleDismissModal}
        submitText={'Understood!'}
      />
    </SafeAreaView>
  );
};

export default MusterUserArmies;

const styles = StyleSheet.create({
  dropdown: { paddingHorizontal: 16, padding: 8, borderRadius: 16 },
  image: {
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    width: Dimensions.get('screen').width,
  },
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
