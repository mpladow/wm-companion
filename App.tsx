import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeStack from "./src/Navigation/Home/HomeStack";
import { StatusBar } from "expo-status-bar";

const App = () => {
	return (
		<NavigationContainer>
			<HomeStack />
      <StatusBar hidden/>
		</NavigationContainer>
	);
};

export default App;


