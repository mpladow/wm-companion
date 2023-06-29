import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import HomeStack from "./src/Navigation/Home/HomeStack";
import { StatusBar } from "expo-status-bar";
import { ThemeContextProvider } from "@context/ThemeContext";

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

const App = () => {
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
