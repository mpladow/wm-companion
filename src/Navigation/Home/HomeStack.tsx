import BlunderChart from "@navigation/Charts/BlunderChart";
import Settings from "@navigation/Settings/screens/Settings";
import VictoryPoints from "@navigation/VictoryPoints/VictoryPoints";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";

export type HomeStackParamList = {
	Home: undefined;
	Settings: undefined;
	Blunders: undefined;
	VictoryPoints: undefined
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
	return (
		<Stack.Navigator initialRouteName='Home'>
			<Stack.Screen options={{ headerShown: false }} name='Home' component={Home} />
			<Stack.Group screenOptions={{ presentation: "containedTransparentModal", headerShown: false }}>
				<Stack.Screen name='Settings' component={Settings} />
				<Stack.Screen name='Blunders' component={BlunderChart} />
				<Stack.Screen name='VictoryPoints' component={VictoryPoints}  />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default HomeStack;
