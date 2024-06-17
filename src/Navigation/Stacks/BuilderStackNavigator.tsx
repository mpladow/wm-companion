import { useTheme } from "@hooks/useTheme";
import BuilderEdit from "@navigation/Builder/BuilderEdit";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Animated, View } from "react-native";
import { Text, TextBlock } from "@components/index";
import BuilderQuickView from "@navigation/Builder/BuilderQuickView";
import AddUnit, { AddUnitProps } from "@navigation/Builder/components/BuilderEdit/AddUnit";
import AddItem, { AddItemProps } from "@navigation/Builder/components/BuilderEdit/AddItem";
import { useTranslation } from "react-i18next";
import BuilderHome from "@navigation/Builder/BuilderHome/BuilderHome";
import AnimatedHeader from "@components/AnimatedHeader/AnimatedHeader";

export type BuilderStackParamList = {
	BuilderHome: undefined;
	BuilderEdit: undefined;
	AddUnit: AddUnitProps;
	AddItem: AddItemProps;
	Settings: undefined;
	Blunders: undefined;
	VictoryPoints: undefined;
	BuilderQuickView: undefined;
};

const Stack = createNativeStackNavigator<BuilderStackParamList>();

const BuilderStackNavigator = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("common");

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
				title: "",
				headerStyle: { backgroundColor: theme.blueGrey },
			}}
		>
			<Stack.Screen
				name='BuilderHome'
				component={BuilderHome}
				options={{
					headerShown: false,
					title: t("ArmyBuilder"),
				}}
			/>
			<Stack.Screen
				name='BuilderEdit'
				component={BuilderEdit}
				options={{
					headerShown: true,
					title: t("ArmyBuilder"),
				}}
			/>
			<Stack.Screen
				name='AddUnit'
				component={AddUnit}
				options={{
					headerShown: true,
					title: t("ArmyBuilder"),
				}}
			/>
			<Stack.Screen
				name='AddItem'
				component={AddItem}
				options={{
					headerShown: true,
					title: "Builder",
				}}
			/>
			<Stack.Screen
				name='BuilderQuickView'
				component={BuilderQuickView}
				options={{
					headerShown: true,
					title: "Builder",
				}}
			/>
		</Stack.Navigator>
	);
};

export default BuilderStackNavigator;
