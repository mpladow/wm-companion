import { Text } from '@components/index';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

type unitDetailsMenuProps = {
  noMagic?: boolean;
  onAddUnit: () => void;
  onAddUpgrade: () => void;
  onDeleteUnit: () => void;
  onPress: () => void;
};
const UnitDetailsMenu = ({
  noMagic,
  onAddUnit,
  onAddUpgrade,
  onDeleteUnit,
  onPress,
}: unitDetailsMenuProps) => {
  const { theme } = useTheme();
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation(['common', 'builder']);
  return (
    <Popover
      isVisible={opened}
      placement={PopoverPlacement.LEFT}
      onRequestClose={() => setOpened(!opened)}
      popoverStyle={{ borderRadius: 24 }}
      arrowSize={{ width: 0, height: 0 }}
      animationConfig={{ duration: 0.5 }}
      from={
        <View>
          <Pressable onPress={() => setOpened(!opened)} hitSlop={36}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.text} />
          </Pressable>
        </View>
      }>
      <View
        style={{
          paddingRight: 10,
          paddingLeft: 12,
          paddingVertical: 10,
          maxWidth: 200,
          backgroundColor: theme.backgroundVariant,
          flex: 1,
          borderRadius: 24,
          overflow: 'hidden',
          gap: 12,
        }}>
        <TouchableOpacity
          onPress={() => onAddUnit()}
          style={[
            { flex: 1, flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <Entypo name="plus" size={24} color={theme.white} />
          </View>
          <Text>{t('AddUnit', { ns: 'builder' })}</Text>
        </TouchableOpacity>
        {!noMagic || noMagic == undefined ? (
          <TouchableOpacity
            onPress={() => {
              setOpened(false);
              onAddUpgrade();
            }}
            style={[
              { flex: 1, flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
              styles.menuButtons,
            ]}>
            <View style={{ marginRight: 8 }}>
              <MaterialCommunityIcons name="sack" size={20} color={theme.white} />
            </View>
            <Text>{t('AddItem', { ns: 'builder' })}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            onPress={() => {}}
            style={[
              { flex: 1, flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
              styles.menuButtons,
            ]}>
            <Text italic style={{ color: theme.white }}>
              No Items Available
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => onDeleteUnit()}
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: theme.danger,
            },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <AntDesign name="delete" size={18} color={theme.white} />
          </View>
          <Text italic style={{ color: theme.white }}>
            {t('Delete', { ns: 'common' })}
          </Text>
        </TouchableOpacity>
      </View>
    </Popover>
    // <Menu opened={opened} onBackdropPress={() => setOpened(!opened)}>
    // 	<MenuTrigger onPress={() => setOpened(!opened)}>
    // 		<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
    // 	</MenuTrigger>
    // 	<MenuOptions
    // 		optionsContainerStyle={{
    // 			borderRadius: 8,
    // 			maxWidth: 150,
    // 			marginTop: -50,
    // 			backgroundColor: theme.blueGrey,
    // 		}}
    // 	>

    // 		<MenuOption
    // 			onSelect={() => {
    // 				setOpened(true);
    // 				onDeleteUnit();
    // 			}}
    // 		>
    // 			<MenuOptionButton
    // 				icon={<AntDesign name='delete' size={18} color={theme.white} />}
    // 				variant={"danger"}
    // 				ButtonText={t("Delete", { ns: "common" })}
    // 			/>
    // 		</MenuOption>
    // 	</MenuOptions>
    // </Menu>
  );
};

export default UnitDetailsMenu;

const styles = StyleSheet.create({
  menuButtons: {
    paddingLeft: 12,
    paddingRight: 44,
    borderRadius: 16,
    minHeight: 40,
    alignItems: 'center',
  },
});
