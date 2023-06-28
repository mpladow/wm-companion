import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
	return (
		<Stack.Navigator initialRouteName='Home'>
			<Stack.Screen options={{ headerShown: false }} name='Home' component={Home} />
		</Stack.Navigator>
	);
};

export default HomeStack;
