import IconButton from '@components/IconButton';
import ChangelogContent from '@components/ChangelogContent';
import { Button, Text, TextBlock } from '@components/index';
import MainContainerWithImage from '@components/MainContainerWithImage';
import LogoWmr from '@components/SVGS/LogoWmr';
import { useUpdateChecker } from '@context/UpdateCheckerContext';
import { Entypo, EvilIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { margin } from '@utils/constants';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Dimensions,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { HEADER_HEIGHT } from 'src/constants/styling';

const Home = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const version = Constants?.expoConfig?.version;
  const armyVersion = Constants?.expoConfig?.extra?.armyVersion;
  const toast = useToast();
  const handlePressSupport = () => {
    Linking.openURL(
      'https://www.paypal.com/donate/?business=2D9BN2Z8BVZH8&no_recurring=0&item_name=To+maintain+the+Apple+Developer+Licence+(approx+150aud+per+year)&currency_code=AUD',
    );
  };
  const handleEmailPress = async () => {
    toast.show('Email Copied!');
    await Clipboard.setStringAsync('ml.development.2022@gmail.com');
    const platformDetails = Platform.OS;
    Linking.openURL(
      `mailto:ml.development.2022@gmail.com?subject=${encodeURIComponent(
        `WM-Companion Bug Report - ${platformDetails}`,
      )}&body=${encodeURIComponent(
        `Please provide brief description of the issue, and any notes on how to replicate it.`,
      )}`,
    );
  };
  const { t } = useTranslation(['home', 'common']);

  const { changelog, clearDismissedDEBUG } = useUpdateChecker();

  const generateContent = () => <ChangelogContent changelog={changelog} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <MainContainerWithImage>
        <ScrollView style={{ zIndex: 9, flex: 1, padding: 16, paddingTop: HEADER_HEIGHT }}>
          <TextBlock variant="large">
            <>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <LogoWmr height={80} width={200} />
                <View style={{ marginTop: -12 }}>
                  <Text variant="heading3" style={{ fontSize: 24 }}>
                    {t('Companion', { ns: 'common' })}
                  </Text>
                </View>
              </View>
            </>
          </TextBlock>
          <View style={{ justifyContent: 'space-between', paddingBottom: 250 }}>
            <TextBlock variant="large">
              <Text>{t('Tagline')}</Text>
            </TextBlock>

            <TextBlock variant="large">
              <Text bold>{t('Disclaimer')}</Text>
            </TextBlock>
            <TextBlock variant="small">
              <TouchableWithoutFeedback onLongPress={() => clearDismissedDEBUG()}>
                <Text bold>
                  {t('AppVersion', { ns: 'common' })}: v{version}
                </Text>
              </TouchableWithoutFeedback>
            </TextBlock>
            <TextBlock variant="large">
              <Text bold>
                {t('ArmyVersion', { ns: 'common' })}: v{armyVersion}
              </Text>
            </TextBlock>
            <TextBlock variant="large">
              <Text>Developed by Ghoulish Wargamer</Text>
              <Button
                onPress={() => Linking.openURL('https://www.youtube.com/@ghoulishwargamer')}
                variant={'text'}>
                <Text bold>https://www.youtube.com/@ghoulishwargamer</Text>
              </Button>
            </TextBlock>
            <View style={{ paddingVertical: 4 }}>
              <IconButton
                onPress={() => navigation.navigate('Preferences')}
                variant={'primary'}
                title={t('Preferences', { ns: 'common' })}
                icon={<EvilIcons name="gear" size={24} color="black" />}
                isStackNavigation={true}></IconButton>
            </View>

            <View style={{ paddingVertical: 8 }}>
              <IconButton
                onPress={() => navigation.navigate('Credits')}
                variant={'primary'}
                title={t('Credits', { ns: 'common' })}
                icon={<MaterialCommunityIcons name="hand-clap" size={24} color="black" />}
                isStackNavigation={true}></IconButton>
            </View>
            <View style={{ paddingVertical: 8 }}>
              <IconButton
                onPress={() => navigation.navigate('Collection', { screen: 'CollectionHome' })}
                variant={'primary'}
                title={'Miniatures Collection'}
                icon={<Ionicons name="library" size={24} color="black" />}
                isStackNavigation={true}></IconButton>
            </View>
            <View style={{ paddingVertical: 8 }}>
              <IconButton
                onPress={() => handleEmailPress()}
                variant={'primary'}
                title={t('ReportBug', { ns: 'common' })}
                icon={<Ionicons name="bug-outline" size={24} color="black" />}
                isNewWindow={true}></IconButton>
            </View>
            {Platform.OS == 'android' ? (
              <View style={{ marginVertical: margin * 3 }}>
                <Button onPress={handlePressSupport} variant={'primary'}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginRight: 8 }}>
                      <Entypo name="paypal" size={24} color={theme.text} />
                    </View>

                    <Text bold>{t('SupportDevelopment', { ns: 'home' })}</Text>
                  </View>
                </Button>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </MainContainerWithImage>
      {/* <StandardModal
				content={generateContent()}
				heading={
					changelog ? `Changelog v${changelog?.version}` : "If you're seeing this, please report a bug :)"
				}
				onCancel={handleDismissModal}
				visible={showChangeLogModal}
				onSubmit={handleDismissModal}
				submitText={"Understood!"}
			/> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  dropdown: { padding: 8, borderRadius: 16 },
  image: {
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    width: Dimensions.get('screen').width,
  },
});
