import { useTheme } from "@hooks/useTheme";
import Home from "@navigation/About/Home";
import Preferences from "@navigation/About/Preferences";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "@components/index";
import Credits from "@navigation/About/Credits";
import { useTranslation } from "react-i18next";
import CollectionStackNavigator from "./CollectionStackNavigator";

export type AboutStackParamList = {
	Home: undefined;
	Preferences: undefined;
	Credits: undefined;
	Collection: undefined;
};
const Stack = createNativeStackNavigator<AboutStackParamList>();

const AboutStackNavigator = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("common");
	return (
		<Stack.Navigator
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
			<Stack.Screen name='Home' component={Home} options={{ title: t("About") }} />
			<Stack.Screen name='Preferences' component={Preferences} options={{ title: t("Preferences") }} />
			<Stack.Screen name='Credits' component={Credits} options={{ title: t("Credits") }} />
			<Stack.Screen
				name='Collection'
				component={CollectionStackNavigator}
				options={{ title: "Collection", headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

export default AboutStackNavigator;
