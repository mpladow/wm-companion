import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

const HeaderMenu = () => {
  const navigation = useNavigation();
  const [showPopover, setShowPopover] = useState(false);
  const { theme } = useTheme();

  return (
    <Popover
      isVisible={showPopover}
      placement={PopoverPlacement.BOTTOM}
      onRequestClose={() => setShowPopover(false)}
      popoverStyle={{ borderRadius: 24 }}
      arrowSize={{ width: 0, height: 0 }}
      onOpenStart={() => console.log('OPENING')}
      from={
        <Pressable onPress={() => setShowPopover(true)}>
          <Entypo name="dots-three-vertical" size={20} color={theme.text} />
        </Pressable>
      }>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          maxWidth: 200,
          backgroundColor: theme.blueGrey,
          flex: 1,
          borderRadius: 24,
          overflow: 'hidden',
          gap: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            navigation.navigate('BuilderQuickView');
          }}
          style={[
            { flex: 1, flexDirection: 'row', paddingVertical: 8, backgroundColor: theme.blueGrey },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <Entypo name="export" size={20} color={theme.text} />
          </View>
          <Text style={{ color: theme.text }}>{t('Export List')}</Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
};

export default HeaderMenu;

const styles = StyleSheet.create({
  image: {
    //  justifyContent: 'center',
    //  top: 0,
    minHeight: 16,
  },
  menuButtons: {
    paddingLeft: 12,
    paddingRight: 44,
    borderRadius: 16,
    minHeight: 40,
    alignItems: 'center',
  },
});
