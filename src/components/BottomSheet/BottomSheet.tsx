import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetModalProps,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

export type BottomSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

export interface BottomSheetProps extends Omit<BottomSheetModalProps, 'children' | 'ref'> {
  children: React.ReactNode;
  isVisible?: boolean;
  onDismiss?: () => void;
  sheetViewStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  enableBackdrop?: boolean;
  backdropComponent?: (props: BottomSheetBackdropProps) => React.ReactElement | null;
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  (
    {
      children,
      isVisible,
      onDismiss,
      snapPoints = ['50%'],
      enableBackdrop = true,
      backdropComponent,
      sheetViewStyle,
      contentContainerStyle,
      ...modalProps
    },
    ref,
  ) => {
    const modalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(
      ref,
      () => ({
        present: () => modalRef.current?.present(),
        dismiss: () => modalRef.current?.dismiss(),
      }),
      [],
    );

   //  useEffect(() => {
   //    const handleBackButton = () => {
   //      return modalRef.current?.close(); // dismiss() returns true/false, it means there is any instance of Bottom Sheet visible on current screen.
   //    };

   //    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
   //  }, []);

    useEffect(() => {
      if (typeof isVisible === 'undefined') {
        return;
      }

      if (isVisible) {
        modalRef.current?.present();
      } else {
        modalRef.current?.close();
      }
    }, [isVisible]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      ),
      [],
    );

    const resolvedBackdrop = backdropComponent ?? (enableBackdrop ? renderBackdrop : undefined);

    return (
      <BottomSheetModal
        ref={modalRef}
		  
        snapPoints={snapPoints}
        backdropComponent={resolvedBackdrop}
        onDismiss={onDismiss}
        {...modalProps}>
        <BottomSheetView style={[styles.sheet, sheetViewStyle, contentContainerStyle]}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
	 overflow: "hidden"
  },
});

export default BottomSheet;
