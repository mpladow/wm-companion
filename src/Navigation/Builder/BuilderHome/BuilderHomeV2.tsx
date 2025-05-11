import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { StandardModal } from '@components/index';
import { LinearGradient } from 'expo-linear-gradient';
import ArmySectionList from './components/ArmySectionList';
import { useTheme } from '@hooks/useTheme';
import PopupConfirm from '@components/PopupConfirm';
import AddArmyButton from './components/AddArmyButton';
import { BuilderStackParamList } from '@navigation/Stacks/BuilderStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArmySectionListV2, { armySectionListDataProps } from './components/ArmySectionListV2';
import { useBuilderV2Context } from '@context/v2/BuilderV2Context';
import { useTranslation } from 'react-i18next';
import { useArmyLists } from '../hooks/useArmyLists';

interface BuilderHomeV2Props extends NativeStackScreenProps<BuilderStackParamList, 'BuilderHomeV2'> {}

const BuilderHomeV2 = ({ navigation, route }: BuilderHomeV2Props) => {
  const { theme } = useTheme();
  const { allUserArmies, getArmyById, deleteArmyById, handleSetFocusedArmyByArmyId, selectedArmyList } =
    useBuilderV2Context();
  const [sectionListData, setSectionListData] = useState<armySectionListDataProps[]>([]);
  const [showArmyNotes, setShowArmyNotes] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const { userArmyListVM } = useArmyLists(allUserArmies);

  useEffect(() => {
    if (userArmyListVM) {
      const favourited = userArmyListVM?.filter((x) => x.isFavourite);
      const notFavourited = userArmyListVM?.filter((x) => !x.isFavourite);
      const sLData: armySectionListDataProps = {
        data: favourited,
        title: 'Favourited',
      };
      const notFavouritedSLData: armySectionListDataProps = {
        data: notFavourited,
        title: 'Armies',
      };

      const arr: armySectionListDataProps[] = [];
      arr.push(sLData);
      arr.push(notFavouritedSLData);
      setSectionListData(arr);
    }
  }, [userArmyListVM]);

  const handleAddArmyPress = useCallback(() => {
    //  console.log('ADD');
    //  ref.current?.present();
    navigation.navigate('ArmyEditorStack');
  }, []);

  const handleShowArmyNotesModal = (armyId: string) => {
    getArmyById(armyId);
    setShowArmyNotes(true);
  };
  const handleDuplicateArmyPress = () => {
    alert('TODO:');
  };

  const handleArmyListPress = (armyId: string) => {
    console.log('🚀 ~ BuilderHomeV2 ~ armyId:', armyId);
    navigation.navigate('BuilderEditV2', { armyId: armyId });
    handleSetFocusedArmyByArmyId(armyId);
  };
  const [focusedArmyId, setFocusedArmyId] = useState<string>();
  const handleArmyListDeletePress = (id: string) => {
    setFocusedArmyId(id);
    setConfirmDialog(true);
  };
  const handleEditArmyPress = () => {
    alert('TODO:');
  };
  const handleToggleFavouritePress = () => {
    alert('TODO:');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ImageBackground
        source={require('../../../../assets/images/wmr_bg.png')}
        resizeMode="cover"
        style={[styles.image]}>
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
          sectionListData={sectionListData}
          handleShowArmyNotesModal={handleShowArmyNotesModal}
          onDuplicateArmyPress={handleDuplicateArmyPress}
          onArmyListPress={handleArmyListPress}
          onArmyListDeletePress={handleArmyListDeletePress}
          handleEditArmyPress={handleEditArmyPress}
          handleToggleFavourite={handleToggleFavouritePress}
        />
        <PopupConfirm
          visible={confirmDialog}
          onConfirm={() => {
            focusedArmyId && deleteArmyById(focusedArmyId);
            setConfirmDialog(false);
          }}
          onCancel={() => {
            setConfirmDialog(false);
          }}
          text={<Text style={{ color: theme.text, fontSize: 16 }}>Do you want to delete this army?</Text>}
          confirmText={t('DeleteArmy', { ns: 'builder' })}
          cancelText={t('Cancel', { ns: 'common' })}
          headerText={t('DeleteArmy', { ns: 'builder' })}
        />
      </ImageBackground>
      <AddArmyButton onAddArmyPress={handleAddArmyPress} theme={theme} buttonName={t('AddArmy')} />
      {/* TODO: ADD BACK IN Army Notes MOdal */}
      {/* <StandardModal
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
      /> */}
      {/* <StandardModal
        content={generateContent()}
        heading={
          changelog
            ? `Changelog v${changelog?.version}`
            : "If you're seeing this, please report a bug :)"
        }
        onCancel={handleDismissModal}
        visible={showChangeLogModal}
        onSubmit={handleDismissModal}
        submitText={'Understood!'}
      /> */}
    </SafeAreaView>
  );
};

export default BuilderHomeV2;

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
