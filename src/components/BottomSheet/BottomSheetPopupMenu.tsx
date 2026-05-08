import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import BottomSheet, { BottomSheetHandle } from './BottomSheet';

export interface PopupMenuItem {
  id: string;
  label: string;
  onPress: () => void;
  description?: string;
  icon?: React.ReactNode;
}

export interface BottomSheetPopupMenuProps extends BottomSheetModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  items?: PopupMenuItem[];
  renderItem?: (item: PopupMenuItem) => React.ReactNode;
  snapPoints?: Array<string | number>;
  header?: React.ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  enableDynamicSizing?: boolean;
}

const BottomSheetPopupMenu = React.forwardRef<BottomSheetHandle, BottomSheetPopupMenuProps>(
  (
    {
      visible,
      onDismiss,
      title,
      items,
      renderItem,
      children,
      header,
      snapPoints = ['32%'],
      sheetStyle,
      itemContainerStyle,
      itemStyle,
      titleStyle,
      enableDynamicSizing,
		...rest
    },
    ref,
  ) => {
    const handleItemPress = useCallback(
      (item: PopupMenuItem) => {
        item.onPress();
        onDismiss();
      },
      [onDismiss],
    );

    const renderedItems = items?.map((item) => (
      <Pressable
        key={item.id}
        style={({ pressed }) => [styles.menuItem, itemStyle, pressed && styles.itemPressed]}
        onPress={() => handleItemPress(item)}>
        {item.icon}
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.description ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
      </Pressable>
    ));

    return (
      <BottomSheet
        ref={ref}
        isVisible={visible}
        onDismiss={onDismiss}
        snapPoints={snapPoints}
        enableBackdrop
        sheetViewStyle={[styles.sheet, sheetStyle]}
        enableDynamicSizing={enableDynamicSizing} {...rest}>
        {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
        {header}
		  {children}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    paddingBottom: 16,
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  itemLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    color: '#d1d5db',
    fontSize: 13,
    marginTop: 4,
  },
  itemPressed: {
    opacity: 0.75,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});

export default BottomSheetPopupMenu;
export type { BottomSheetHandle };

