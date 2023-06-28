import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "./src/Navigation/Home/HomeStack";

const App = () => {
	return (
		<NavigationContainer>
			<HomeStack />
		</NavigationContainer>
	);
};

export default App;


