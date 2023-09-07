import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@navigation/Home/Home";
import TrackerStack from "./TrackerStackNavigator";
import TrackerHome from "@navigation/Tracker/screens/TrackerHome";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TextBlock } from "@components/index";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LogoWmr from "@components/SVGS/LogoWmr";
import BuilderHome from "@navigation/Builder/BuilderHome";
import BuilderStackNavigator from "./BuilderStackNavigator";

const Tab = createBottomTabNavigator();
export const navigatorOptions = {};
const TabStackNavigator = () => {
	const { theme } = useTheme();
	return (
		<Tab.Navigator
			initialRouteName='About'
			screenOptions={(screenProps) => ({
				headerTitle: (props) => (
					<View style={{ flexDirection: "row", alignItems: "center"}}>
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
						<View style={{ alignItems: "center", width: Dimensions.get('screen').width/3, justifyContent: "center" }}>
							{icon}
							<Text style={{ color: focused ? theme.warning : theme.text, fontSize: 12 }}>{label}</Text>
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
				component={Home}
				options={{
					tabBarLabel: "About",
					title: "About",
					headerShadowVisible: false,
					headerStyle: { backgroundColor: theme.blueGrey },
				}}
			/>
			<Tab.Screen
				name='TrackerHome'
				component={TrackerHome}
				options={{
					tabBarLabel: "Tracker",
					title: "Tracker",
					headerShadowVisible: false,
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
