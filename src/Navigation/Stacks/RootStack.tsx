import { StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabStackNavigator from "./TabStackNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrackerStackNavigator from "./TrackerStackNavigator";
import { useTheme } from "@hooks/useTheme";

export type RootStackParamList = {
	MainTabs: undefined;
	TrackerStackNavigator: undefined;
};
const Root = createNativeStackNavigator<RootStackParamList>();
const RootStack = () => {
	const {theme} = useTheme();
	return (
		<Root.Navigator
			initialRouteName='MainTabs'
			screenOptions={{
				headerStyle: { backgroundColor: theme.blueGrey },
			}}
		>
			<Root.Group screenOptions={{ headerShown: false }}>
				<Root.Screen component={TabStackNavigator} name='MainTabs' />
				<Root.Screen component={TrackerStackNavigator} name='TrackerStackNavigator' />
			</Root.Group>
		</Root.Navigator>
	);
};

export default RootStack;

const styles = StyleSheet.create({});
