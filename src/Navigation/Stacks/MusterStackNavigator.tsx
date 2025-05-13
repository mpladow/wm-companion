import MusterArmyDetails from '@navigation/Muster/MusterArmyDetails/MusterArmyDetails';
import MusterCreateStack from '@navigation/Muster/MusterCreateStack/MusterCreateStack';
import MusterQuickView from '@navigation/Muster/MusterQuickView';
import MusterUserArmies from '@navigation/Muster/MusterUserArmies';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type NativeStackParamList = {
  MusterUserArmies: undefined;
  MusterCreateStack: undefined;
  MusterArmyDetails: undefined;
  MusterQuickView: undefined;
};
const Stack = createNativeStackNavigator<NativeStackParamList>();

export const MusterStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MusterUserArmies"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MusterUserArmies" component={MusterUserArmies} />
      <Stack.Screen name="MusterCreateStack" component={MusterCreateStack} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="MusterArmyDetails" component={MusterArmyDetails} />
      <Stack.Screen name="MusterQuickView" component={MusterQuickView} />
    </Stack.Navigator>
  );
};
