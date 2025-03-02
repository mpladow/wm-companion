import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeContextProvider } from '@context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { VPContextProvider } from '@context/VPContext';
import RootStack from '@navigation/Stacks/RootStack';
import { BuilderContextProvider } from '@context/BuilderContext';
import { MenuProvider } from 'react-native-popup-menu';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ToastProvider } from 'react-native-toast-notifications';
import './src/i18n/i18n';
import { SettingsContextProvider } from '@context/SettingsContext';
import { CollectionProvider } from '@context/CollectionContext';
import { UpdateCheckerContextProvider } from '@context/UpdateCheckerContext';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FactionProvider } from '@context/FactionDataContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BuilderV2ContextProvider } from '@context/BuilderV2Context';

const darkTheme = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    darkGreen: '#344e41', //dark green
    lightBrown: '#dda15e', //light brown
    darkerGreen: '#ccd5ae', // darkgreen
    darkerBrown: '#6c584c', // dark brown
    textWhite: '#ffffff',
    textDark: '#14213d',
    danger: '#d90429',
    warning: '#fca311',
  },
};

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          GaramondItalic: require('./assets/fonts/EBGaramond-Italic.ttf'),
          GaramondMedium: require('./assets/fonts/EBGaramond-Medium.ttf'),
          GaramondMediumItalic: require('./assets/fonts/EBGaramond-MediumItalic.ttf'),
          GaramondRegular: require('./assets/fonts/EBGaramond-Regular.ttf'),
          GaramondBold: require('./assets/fonts/EBGaramond-ExtraBold.ttf'),
          'PTSans-Bold': require('./assets/fonts/PTSans-Bold.ttf'),
          'PTSans-Regular': require('./assets/fonts/PTSans-Regular.ttf'),
          'PTSans-Italic': require('./assets/fonts/PTSans-Italic.ttf'),
          'BarlowCondensed-Bold': require('./assets/fonts/Barlow_Condensed/BarlowCondensed-Bold.ttf'),
          'BarlowCondensed-Regular': require('./assets/fonts/Barlow_Condensed/BarlowCondensed-Regular.ttf'),
          'BarlowCondensed-Italic': require('./assets/fonts/Barlow_Condensed/BarlowCondensed-Italic.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(() => {
          setAppReady(true);
        }, 1000);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const loadApp = async () => {
      if (appReady) {
        await SplashScreen.hideAsync();
      }
    };
    loadApp();
  }, [appReady]);

  if (!appReady) {
    return null;
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeContextProvider>
        <ToastProvider>
          <UpdateCheckerContextProvider>
            <SettingsContextProvider>
              <RootSiblingParent>
                <MenuProvider>
                  <CollectionProvider>
                    <FactionProvider>
                      <BuilderV2ContextProvider>
                        <BuilderContextProvider>
                          <VPContextProvider>
                            <NavigationContainer theme={darkTheme}>
                              <BottomSheetModalProvider>
                                <RootStack />
                                <StatusBar translucent />
                              </BottomSheetModalProvider>
                            </NavigationContainer>
                          </VPContextProvider>
                        </BuilderContextProvider>
                      </BuilderV2ContextProvider>
                    </FactionProvider>
                  </CollectionProvider>
                </MenuProvider>
              </RootSiblingParent>
            </SettingsContextProvider>
          </UpdateCheckerContextProvider>
        </ToastProvider>
      </ThemeContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
});
