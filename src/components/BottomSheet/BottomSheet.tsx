import { StyleSheet, Text, View } from 'react-native';
import { RefObject, useEffect } from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type RNBottomSheetType = {
  ref: RefObject<BottomSheetModal>;
  onChange: () => void;
};
const RNBottomSheet = ({ ref, onChange }: RNBottomSheetType) => {
  //   useEffect(() => {
  //     ref.current?.present();
  //   }, []);

  return (
    <BottomSheetModal ref={ref} onChange={onChange}>
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RNBottomSheet;

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
});
