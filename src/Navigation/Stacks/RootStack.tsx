import { StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabStackNavigator from "./TabStackNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrackerStackNavigator from "./TrackerStackNavigator";

export type RootStackParamList = {
	MainTabs: undefined;
	TrackerStackNavigator: undefined;
};
const Root = createNativeStackNavigator<RootStackParamList>();
const RootStack = () => {
	return (
		<Root.Navigator initialRouteName='MainTabs'>
			<Root.Group screenOptions={{ headerShown: false }}>
				<Root.Screen component={TabStackNavigator} name='MainTabs' />
				<Root.Screen component={TrackerStackNavigator} name='TrackerStackNavigator' />
			</Root.Group>
		</Root.Navigator>
	);
};

export default RootStack;

const styles = StyleSheet.create({});
