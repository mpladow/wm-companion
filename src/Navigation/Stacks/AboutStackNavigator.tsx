import { useTheme } from "@hooks/useTheme";
import Home from "@navigation/About/Home";
import Preferences from "@navigation/About/Preferences";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "@components/index";
import Credits from "@navigation/About/Credits";

export type AboutStackParamList = {
	Home: undefined;
	Preferences: undefined;
	Credits: undefined;
};
const Stack = createNativeStackNavigator<AboutStackParamList>();

const AboutStackNavigator = () => {
	const { theme } = useTheme();

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
			<Stack.Screen name='Home' component={Home} options={{title: "About"}} />
			<Stack.Screen name='Preferences' component={Preferences} />
			<Stack.Screen name='Credits' component={Credits} />
		</Stack.Navigator>
	);
}

export default AboutStackNavigator;
