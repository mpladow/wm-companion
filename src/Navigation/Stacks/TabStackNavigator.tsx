import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@navigation/About/Home";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TextBlock } from "@components/index";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BuilderStackNavigator from "./BuilderStackNavigator";
import TrackerStackNavigator from "./TrackerStackNavigator";
import AboutStackNavigator from "./AboutStackNavigator";
import fonts from "@utils/fonts";

const Tab = createBottomTabNavigator();
export const navigatorOptions = {};
const TabStackNavigator = () => {
	const { theme } = useTheme();
	return (
		<Tab.Navigator
			initialRouteName='About'
			screenOptions={(screenProps) => ({
				headerShown: screenProps.route.name == "Tracker" ? false : true,
				headerTitle: (props) => (
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text
							variant='heading3'
							style={{
								fontSize: 28,
							}}
						>
							{props.children}
						</Text>
					</View>
				),
				tabBarShowLabel: false,
				tabBarIcon: ({ color, size, focused }) => {
					let icon: JSX.Element = <></>;
					let label = "";
					switch (screenProps.route.name) { 
						case "TrackerHome":
							label = "Tracker";
							icon = (
								<MaterialCommunityIcons
									name='counter'
									size={24}
									color={focused ? theme.warning : theme.text}
								/>
							);
							break;
						case "ArmyBuilder":
							label = "Army Builder";
							icon = (
								<MaterialCommunityIcons
									name='sword-cross'
									size={24}
									color={focused ? theme.warning : theme.text}
								/>
							);
							break;
						case "About":
							label = "About";
							icon = (
								<AntDesign name='infocirlceo' size={24} color={focused ? theme.warning : theme.text} />
							);
							break;
						default:
							label = screenProps.route.name;
							break;
					}
					return (
						<View
							style={{
								alignItems: "center",
								width: Dimensions.get("screen").width / 3,
								justifyContent: "center",
							}}
						>
							{icon}
							<Text style={[{ color: focused ? theme.warning : theme.text, fontSize: 16, fontFamily: fonts.BarlowCodensedBold }]}>{label}</Text>
						</View>
					);
				},
				tabBarStyle: {
					height: Platform.OS == "ios" ? 90 : 70,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.backgroundVariant,
					borderTopColor: "transparent",
				},
			})}
		>
			<Tab.Screen
				name='About'
				component={AboutStackNavigator}
				options={{
					unmountOnBlur: true,
					tabBarLabel: "About",
					title: "About",
					headerShadowVisible: false,
					headerShown: false,
					headerStyle: { backgroundColor: theme.blueGrey },
				}}
			/>
			<Tab.Screen
				name='TrackerHome'
				component={TrackerStackNavigator}
				options={{
					tabBarLabel: "Tracker",
					title: "Tracker",
					headerShadowVisible: false,
					headerShown: false,
					headerStyle: { backgroundColor: theme.blueGrey },
				}}
			/>

			<Tab.Screen
				name='ArmyBuilder'
				component={BuilderStackNavigator}
				options={{
					title: "Army Builder",
					tabBarLabel: "Army",
					headerShadowVisible: false,
					headerShown: false,
					headerStyle: { backgroundColor: theme.background },
				}}
			/>
		</Tab.Navigator>
	);
};

export default TabStackNavigator;

const styles = StyleSheet.create({});
