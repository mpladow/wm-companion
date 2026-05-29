import { Text } from '@components/index';
import { useTheme } from '@hooks/useTheme';
import CreateArmy from '@navigation/ArmyCreation/CreateArmy';
import EditArmy from '@navigation/ArmyCreation/EditArmy';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export type BuilderCreationStackParamList = {
  CreateArmy: undefined;
  EditArmy: {
    factionSelection: string;
    armyId: string;
  };
};
const Stack = createNativeStackNavigator<BuilderCreationStackParamList>();

const BuilderCreationStackNavigator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(['builder', 'common', 'forms']);

  return (
    <Stack.Navigator
      initialRouteName="CreateArmy"
      screenOptions={(screenProps) => ({
        headerShown: true,
        headerTitle: (props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              variant="heading3"
              style={{
                fontSize: 28,
              }}>
              {props.children}
            </Text>
          </View>
        ),
        headerBackTitleVisible: false,
        headerTintColor: theme.warning,
        headerShadowVisible: false,
        title: '',
        headerStyle: { backgroundColor: theme.blueGrey },
      })}>
      <Stack.Screen
        name="CreateArmy"
        component={CreateArmy}
        options={{
          title: t('CreateArmy'),
        }}
      />
      <Stack.Screen
        name="EditArmy"
        component={EditArmy}
        options={{
          title: t('EditArmy'),
        }}
      />
    </Stack.Navigator>
  );
};

export default BuilderCreationStackNavigator;
