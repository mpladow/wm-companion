import { useTheme } from "@hooks/useTheme";
import BlunderChart from "@navigation/Charts/BlunderChart";
import Home from "@navigation/Home/Home";
import Settings from "@navigation/Settings/screens/Settings";
import TrackerHome from "@navigation/Tracker/screens/TrackerHome";
import VictoryPoints from "@navigation/VictoryPoints/VictoryPoints";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Tracker } from "../Tracker/screens/Tracker";

export type TrackerStackParamList = {
	TrackerHome: undefined;
	Tracker: undefined;
	Settings: undefined;
	Blunders: undefined;
	VictoryPoints: undefined;
};

const Stack = createNativeStackNavigator<TrackerStackParamList>();

const TrackerStackNavigator = () => {
	const {theme} = useTheme();
	return (
		<Stack.Navigator
			initialRouteName='Tracker'
			screenOptions={{
				headerStyle: { backgroundColor: theme.blueGrey },
			}}
		>
			<Stack.Screen options={{ headerShown: false }} name='Tracker' component={Tracker} />
			<Stack.Group screenOptions={{ presentation: "containedTransparentModal", headerShown: false }}>
				<Stack.Screen name='Settings' component={Settings} options={{ headerTitle: "Information" }} />
				<Stack.Screen name='Blunders' component={BlunderChart} />
				<Stack.Screen name='VictoryPoints' component={VictoryPoints} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default TrackerStackNavigator;
