import { StyleSheet, View } from 'react-native';
import React, { forwardRef, RefObject, useCallback, useEffect } from 'react';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNBottomSheet from '@components/BottomSheet/BottomSheet';
import Button from '@components/button';
import { ArmyListProps } from '@context/BuilderV2Context';
import CreateArmyForm from '../CreateArmyModal/components/CreateArmyForm';
import EditArmyForm from '../CreateArmyModal/components/EditArmyForm';
import { useTheme } from '@hooks/useTheme';
import { useTranslation } from 'react-i18next';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import ArmyCreationV2 from '../CreateArmyModal/components/ArmyCreationV2';

export type CreateArmyModalV2Type = {
  onChange: () => void;
  onDismiss: () => void;
  onConfirm: (isNew: boolean) => void;
  focusedArmy?: ArmyListProps;
};
const CreateArmyModalV2 = forwardRef<BottomSheetModal, CreateArmyModalV2Type>(
  ({ onChange, onDismiss, focusedArmy, onConfirm }: CreateArmyModalV2Type, ref) => {
    const { theme } = useTheme();
    const { t } = useTranslation(['builder', 'common', 'forms']);

    const handleCreateArmy = () => {
      // handle army creation here
      // dismiss modal and then navigate to next screen
    };

    //   const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
    //     if (factionName == '') {
    //       console.error('🚀 ~ onConfirmCreateArmyPress ~ factionName:', factionName);
    //       setFactionNameError(true);
    //     } else {
    //       setFactionNameError(false);
    //     }
    //     if (factionSelection && factionName != '') {
    //       builder
    //         .addUserArmyList(factionSelection, factionName, autopopulate, CURRENT_VERSION)
    //         .then((result) => {
    //           builder.setSelectedArmyList(result);
    //         })
    //         .catch(() => {})
    //         .finally(() => {
    //           // navigation.navigate("BuilderEdit");
    //           handleDismiss();
    //           toast.show(`New army created!`);
    //         });
    //     }
    //   };

    // renders
    const renderFooter = useCallback(
      (props) => (
        <BottomSheetFooter {...props} bottomInset={24}>
          <View style={styles.footerContainer}>
            <View style={{ paddingTop: 16, flexDirection: 'column' }}>
              <Button onPress={() => onConfirm(true)} variant={'confirm'}>
                <ThemedText bold style={{ textTransform: 'uppercase', color: theme.black }}>
                  {t('Create', { ns: 'common' })}
                </ThemedText>
              </Button>
              <Button onPress={() => onDismiss()} variant={'text'}>
                <ThemedText bold style={{ textTransform: 'uppercase', color: theme.black }}>
                  {t('Cancel', { ns: 'common' })}
                </ThemedText>
              </Button>
            </View>
          </View>
        </BottomSheetFooter>
      ),
      [],
    );

    const renderHandle = useCallback((props: BottomSheetHandleProps) => {
      return (
        <View
          style={{
            backgroundColor: theme.blueGrey,
            height: 20,
            alignItems: 'center',
            paddingVertical: 12,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}>
          <View style={{ backgroundColor: 'white', width: 40, height: 4 }}></View>
        </View>
      );
    }, []);

    return (
      <RNBottomSheet
        canScroll
        ref={ref}
        onChange={() => {
          console.log('close');
        }}
        onDismiss={onDismiss}
        //   footerComponent={renderFooter}
        handleComponent={renderHandle}
        bottomSheetProps={{
          enableDynamicSizing: true,
          snapPoints: ['95%'],
          index: 0,
          containerStyle: { borderTopLeftRadius: 24 },
        }}
        title={'CreateArmy'}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 12,
            paddingBottom: 48,
            backgroundColor: theme.blueGrey,
          }}>
          <>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <ArmyCreationV2 theme={theme} handleDismissModal={onDismiss} />
            </View>
          </>
        </View>
      </RNBottomSheet>
      //  <BottomSheetModal ref={ref} onChange={onChange}>
      //    <BottomSheetView style={styles.contentContainer}>
      //      <Text>Awesome 🎉</Text>
      //    </BottomSheetView>
      //  </BottomSheetModal>
    );
  },
);

export default CreateArmyModalV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
});
