import { BottomSheet } from '@components/BottomSheet';
import StandardModalHeader from '@components/StandardModal/StandardModalHeader';
import { ArmyListProps } from '@context/BuilderContext';
import { Theme } from '@hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import CreateArmyForm from './components/CreateArmyForm';
import EditArmyForm from './components/EditArmyForm';

type CreateArmyModalType = {
  onDismissCreateArmyModal: () => void;
  theme: Theme;
  isVisible: boolean;
  focusedArmy?: ArmyListProps;
};

const CreateArmyModal = ({
  isVisible,
  theme,
  focusedArmy,
  onDismissCreateArmyModal,
}: CreateArmyModalType) => {
  const { t } = useTranslation(['builder', 'common', 'forms']);

  return (
    <BottomSheet
      isVisible={isVisible}
      onDismiss={onDismissCreateArmyModal}
      enablePanDownToClose={true}
		overDragResistanceFactor={6}
		enableOverDrag={false}
		enableDismissOnClose={true}
      snapPoints={['100%']}
      handleStyle={{ backgroundColor: theme.background }}
      index={0}
      handleIndicatorStyle={{ backgroundColor: theme.text }}
      sheetViewStyle={{ backgroundColor: theme.background }}
      enableDynamicSizing={false}
      detached>
      <StandardModalHeader
        title={focusedArmy ? t('EditArmy') : t('CreateArmy')}
        onClose={onDismissCreateArmyModal}
      />
      <View style={{ flex: 1, flexDirection: 'column', padding: 12 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              {!focusedArmy ? (
                <CreateArmyForm theme={theme} handleDismissModal={onDismissCreateArmyModal} />
              ) : (
                <EditArmyForm
                  theme={theme}
                  focusedArmy={focusedArmy}
                  onDismiss={onDismissCreateArmyModal}
                />
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
      </View>
    </BottomSheet>
  );
};
export default CreateArmyModal;
