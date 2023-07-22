import React, { useCallback } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import HomeStack from "./src/Navigation/Home/HomeStack";
import { StatusBar } from "expo-status-bar";
import { ThemeContextProvider } from "@context/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

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

// SplashScreen.preventAutoHideAsync();

const App = () => {
	const [fontsLoaded] = useFonts({
		'GaramondItalic': require("./assets/fonts/EBGaramond-Italic.ttf"),
		'GaramondRegular': require("./assets/fonts/EBGaramond-Regular.ttf"),
		'GaramondBold': require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
		'PTSans-Bold': require("./assets/fonts/PTSans-Bold.ttf")
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}
	return (
		<ThemeContextProvider>
			<NavigationContainer theme={darkTheme}>
				<HomeStack />
				<StatusBar hidden />
			</NavigationContainer>
		</ThemeContextProvider>
	);
};

export default App;
