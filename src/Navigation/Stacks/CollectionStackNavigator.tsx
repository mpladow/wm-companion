import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CollectionHome from "@navigation/Collection/CollectionHome";
import CollectionEdit from "@navigation/Collection/CollectionEdit";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

export type CollectionStackParamsList = {
	CollectionEdit: { collectionId: string; unitName: string };
	CollectionCreate: undefined;
	CollectionHome: undefined;
};
const CollectionStack = createNativeStackNavigator();
const CollectionStackNavigator = () => {
	const { theme } = useTheme();
	const nav = useNavigation();
	return (
		<CollectionStack.Navigator
			screenOptions={{
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
				headerBackTitleVisible: false,
				headerTintColor: theme.warning,
				headerShadowVisible: false,
				headerStyle: { backgroundColor: theme.blueGrey },
			}}
		>
			<CollectionStack.Screen
				name='CollectionHome'
				component={CollectionHome}
				options={{
					// headerShown: false,
					headerLeft: (x) => (
						<Pressable onPress={() => nav.goBack()}>
							<AntDesign name='left' size={24} color={x.tintColor} />
						</Pressable>
					),
					title: "Collection",
				}}
			/>
			<CollectionStack.Screen name='CollectionEdit' component={CollectionEdit} />
		</CollectionStack.Navigator>
	);
};

export default CollectionStackNavigator;

const styles = StyleSheet.create({});
