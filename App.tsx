import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ThemeContextProvider } from "@context/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { VPContextProvider } from "@context/VPContext";
import RootStack from "@navigation/Stacks/RootStack";
import { BuilderContextProvider } from "@context/BuilderContext";
import { MenuProvider } from "react-native-popup-menu";
import { RootSiblingParent } from "react-native-root-siblings";
import { ToastProvider } from "react-native-toast-notifications";
import "./src/i18n/i18n";
import { SettingsContextProvider } from "@context/SettingsContext";

const darkTheme = {
	dark: true,
	colors: {
		...DefaultTheme.colors,
		darkGreen: "#344e41", //dark green
		lightBrown: "#dda15e", //light brown
		darkerGreen: "#ccd5ae", // darkgreen
		darkerBrown: "#6c584c", // dark brown
		textWhite: "#ffffff",
		textDark: "#14213d",
		danger: "#d90429",
		warning: "#fca311",
	},
};

SplashScreen.preventAutoHideAsync();

const App = () => {
	const [fontsLoaded] = useFonts({
		GaramondItalic: require("./assets/fonts/EBGaramond-Italic.ttf"),
		GaramondRegular: require("./assets/fonts/EBGaramond-Regular.ttf"),
		GaramondBold: require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
		"PTSans-Bold": require("./assets/fonts/PTSans-Bold.ttf"),
		"PTSans-Regular": require("./assets/fonts/PTSans-Regular.ttf"),
		"PTSans-Italic": require("./assets/fonts/PTSans-Italic.ttf"),
		"BarlowCondensed-Bold": require("./assets/fonts/Barlow_Condensed/BarlowCondensed-Bold.ttf"),
		"BarlowCondensed-Regular": require("./assets/fonts/Barlow_Condensed/BarlowCondensed-Regular.ttf"),
		"BarlowCondensed-Italic": require("./assets/fonts/Barlow_Condensed/BarlowCondensed-Italic.ttf"),
	});
	useEffect(() => {
		async function prepare() {
			if (fontsLoaded) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				await SplashScreen.hideAsync();
			}
		}

		prepare();
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}
	return (
		<ThemeContextProvider>
			<ToastProvider>
				<SettingsContextProvider>
					<RootSiblingParent>
						<MenuProvider>
							<BuilderContextProvider>
								<VPContextProvider>
									<NavigationContainer theme={darkTheme}>
										<RootStack />
										<StatusBar translucent />
									</NavigationContainer>
								</VPContextProvider>
							</BuilderContextProvider>
						</MenuProvider>
					</RootSiblingParent>
				</SettingsContextProvider>
			</ToastProvider>
		</ThemeContextProvider>
	);
};

export default App;
