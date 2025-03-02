import { StyleSheet, Text, View } from 'react-native';
import { RefObject, useEffect, forwardRef, ReactNode, PropsWithChildren, useCallback } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type RNBottomSheetType = {
  //   ref: RefObject<BottomSheetModal>;
  onChange: () => void;
  title: string;
  /**Determines whether to render a scrollviewView or regular view */
  canScroll?: boolean;
  onDismiss?: () => void;
  bottomSheetProps: Omit<BottomSheetProps, 'children'>;
  isDetached?: boolean;
  footerComponent?: BottomSheetProps['footerComponent'];
  handleComponent?: BottomSheetProps['handleComponent'];
} & PropsWithChildren;

const RNBottomSheet = forwardRef<BottomSheetModal, RNBottomSheetType>(
  (
    {
      onChange,
      canScroll,
      title,
      children,
      onDismiss,
      bottomSheetProps,
      isDetached,
      footerComponent,
      handleComponent,
    }: RNBottomSheetType,
    ref,
  ) => {
    //   useEffect(() => {
    //     ref.current?.present();
    //   }, []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={1}
          disappearsOnIndex={-1}
          pressBehavior={'close'}
          onPress={onDismiss}
          opacity={0.5}
          //  onPress={onDismiss}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        onChange={onChange}
        backdropComponent={renderBackdrop}
        enableDismissOnClose
        detached={isDetached}
        footerComponent={footerComponent}
        handleComponent={handleComponent}
        bottomInset={isDetached ? 24 : 0}
        style={[isDetached && styles.detachedBottomSheet]}
        {...bottomSheetProps}>
        {canScroll ? (
          <BottomSheetScrollView style={styles.contentContainer}>{children}</BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

export default RNBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
   //  alignItems: 'center',
    //  backgroundColor: 'blue',
  },
  detachedBottomSheet: {
    marginHorizontal: 24,
  },
});
