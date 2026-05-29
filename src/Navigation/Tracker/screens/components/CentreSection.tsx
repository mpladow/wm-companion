import { useSettingsContext } from '@context/SettingsContext';
import { useVictoryPoints } from '@context/VPContext';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@hooks/useTheme';
import { ResultProps } from '@utils/types';
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import ResultSection from './ResultSection';

export type MenuOptionsType = {
  label: string;
  onPress: () => void;
  icon: ReactElement;
};
type CentreSectionProps = {
  handleReset: () => void;
  handleSettingsPress: () => void;
  handleBlunderPress: () => void;
  handleScoutingPress: () => void;
  handleOnSavePress: () => void;
  handleVictoryPointsPress: () => void;
  handleToggleOnePlayerMode: () => void;
  topResultValue?: ResultProps;
  bottomResultValue?: ResultProps;
};
const CentreSection = ({
  handleReset,
  handleSettingsPress,
  handleBlunderPress,
  handleScoutingPress,
  handleToggleOnePlayerMode,
  handleVictoryPointsPress,
  topResultValue,
  bottomResultValue,
  handleOnSavePress,
}: CentreSectionProps) => {
  const { theme } = useTheme();
  const vpContext = useVictoryPoints();
  const { settings } = useSettingsContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const { t } = useTranslation(['tracker', 'home', 'common']);

  const onExpandedPress = () => {
    console.log(menuOpen ? 'expanded' : 'collapsed');
    setMenuOpen(!menuOpen);
  };
  const test = [
    {
      label: t('Exit', { ns: 'common' }),
      onPress: handleSettingsPress,
      // icon: <Ionicons name='settings' size={24} color={theme.text} />,
      icon: <Ionicons name="exit-outline" size={24} color={theme.text} />,
    } as MenuOptionsType,
    {
      label: !settings.trackerTwoPlayerMode ? t('SetSoloMode') : t('SetTwoPlayerMode'),
      onPress: handleToggleOnePlayerMode,
      // icon: <Ionicons name='settings' size={24} color={theme.text} />,
      icon: !settings.trackerTwoPlayerMode ? (
        <Entypo name="user" size={20} color={theme.text} />
      ) : (
        <Entypo name="users" size={20} color={theme.text} />
      ),
    } as MenuOptionsType,
    {
      label: t('BlunderChart'),
      onPress: handleBlunderPress,
      icon: <Ionicons name="warning" size={24} color={theme.text} />,
    },
    {
      label: t('ScoutingChart'),
      onPress: handleScoutingPress,
      icon: <FontAwesome name="binoculars" size={20} color={theme.text} />,
    },
    // {
    // 	label: "Save Game",
    // 	onPress: handleOnSavePress,
    // 	icon: <FontAwesome name='save' size={20} color={theme.text} />,
    // },
  ];
  const [showPopover, setShowPopover] = useState(false);
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        <TouchableOpacity onPress={handleReset}>
          <Ionicons name="refresh" size={32} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ResultSection
        isTwoPlayerMode={settings.trackerTwoPlayerMode}
        resultOne={bottomResultValue}
        resultTwo={topResultValue}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'visible',
          zIndex: 999999,
        }}>
        {/* <MenuModal
					options={test}
					visible={menuOpen}
					onDismiss={() => setMenuOpen(!setxMenuOpen)}
					handleMenuPress={onExpandedPress}
				/> */}
        {/* <Menu style={{ zIndex: 99 }}>
          <MenuTrigger style={{ padding: 12, paddingRight: 4 }}>
            <MaterialCommunityIcons name="dots-vertical" size={32} color={theme.text} />
          </MenuTrigger>
          <MO
            optionsContainerStyle={{
              backgroundColor: theme.black,
              borderRadius: 8,
              maxWidth: 170,
              marginTop: -100,
            }}>
            {test.map((x) => {
              return (
                <MenuOption onSelect={() => x.onPress()}>
                  <MenuOptionButton icon={x.icon} variant={'outline'} ButtonText={x.label} />
                </MenuOption>
              );
            })}
          </MO>
        </Menu> */}
        <Popover
          isVisible={showPopover}
          placement={PopoverPlacement.BOTTOM}
          onRequestClose={() => setShowPopover(false)}
          popoverStyle={{ borderRadius: 24 }}
          arrowSize={{ width: 0, height: 0 }}
          onOpenStart={() => console.log('OPENING')}
			 animationConfig={{duration: 0}}
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
            {test.map((x) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setShowPopover(false);
                    x.onPress();
                  }}
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      paddingVertical: 8,
                      backgroundColor: theme.blueGrey,
                    },
                    styles.menuButtons,
                  ]}>
                  <View style={{ marginRight: 8 }}>{x.icon}</View>
                  <Text style={{ color: theme.text }}>{x.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Popover>
      </View>
    </>
  );
};

export default CentreSection;

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
