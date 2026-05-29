import { useTheme } from '@hooks/useTheme';
import { Dimensions, Modal, ModalProps, ScrollView, StyleSheet, View } from 'react-native';
import Button, { buttonProps } from '../button';
import CustomText from '../CustomText';
import StandardModalHeader from './StandardModalHeader';

export type StandardModalType = {
  content: React.ReactNode;
  heading: string;
  onSubmit?: () => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  variant?: buttonProps['variant'];
} & ModalProps;
const StandardModal = ({
  heading,
  content,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  variant = 'confirm',
  ...rest
}: StandardModalType) => {
  const { theme } = useTheme();
  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      <View
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: 12 }}>
        <View style={styles.modalOverlay} onTouchStart={onCancel}></View>
        <View
          style={{
            marginTop: Dimensions.get('screen').height / 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.blueGrey,
            padding: 16,
            margin: 12,
            borderRadius: 20,
            maxHeight: Dimensions.get('screen').height / 2,
          }}>
          <StandardModalHeader title={heading} onClose={onCancel} />
          <ScrollView showsVerticalScrollIndicator={true} style={{ paddingVertical: 20 }}>
            {content}
          </ScrollView>
          <View style={{ paddingTop: 8 }}>
            {onSubmit && (
              <Button onPress={onSubmit} variant={variant}>
                <CustomText
                  style={{ color: variant == 'danger' ? theme.text : theme.textInverted }}
                  bold>
                  {submitText}
                </CustomText>
              </Button>
            )}

            {cancelText && (
              <Button onPress={onCancel} variant="text">
                <CustomText>{cancelText}</CustomText>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default StandardModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    //backgroundColor: 'blue',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
