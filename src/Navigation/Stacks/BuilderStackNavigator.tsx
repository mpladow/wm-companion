import { useTheme } from "@hooks/useTheme";
import BuilderEdit from "@navigation/Builder/BuilderEdit";
import BuilderHome from "@navigation/Builder/BuilderHome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text, TextBlock } from "@components/index";
import LogoWmr from "@components/SVGS/LogoWmr";

export type BuilderStackParamList = {
	BuilderHome: undefined;
	BuilderEdit: undefined;
	Settings: undefined;
	Blunders: undefined;
	VictoryPoints: undefined;
};

const Stack = createNativeStackNavigator<BuilderStackParamList>();

const BuilderStackNavigator = () => {
	const { theme } = useTheme();

	return (
		<Stack.Navigator
			initialRouteName='BuilderHome'
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
				headerStyle: { backgroundColor: theme.background },
			}}
		>
			<Stack.Screen
				name='BuilderHome'
				component={BuilderHome}
				options={{
					headerShown: true,
					title: "Builder",
				}}
			/>
			<Stack.Screen
				name='BuilderEdit'
				component={BuilderEdit}
				options={{
					headerShown: true,
					title: "Builder",
				}}
			/>
		</Stack.Navigator>
	);
};

export default BuilderStackNavigator;
