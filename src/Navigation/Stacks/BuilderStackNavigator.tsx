import { useTheme } from '@hooks/useTheme';
import BuilderEdit from '@navigation/Builder/BuilderEdit';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, View } from 'react-native';
import { Text, TextBlock } from '@components/index';
import BuilderQuickView from '@navigation/Builder/BuilderQuickView';
import AddUnit, { AddUnitProps } from '@navigation/Builder/components/BuilderEdit/AddUnit';
import AddItem, { AddItemProps } from '@navigation/Builder/components/BuilderEdit/AddItem';
import { useTranslation } from 'react-i18next';
import BuilderHome from '@navigation/Builder/BuilderHome/BuilderHome';
import AnimatedHeader from '@components/AnimatedHeader/AnimatedHeader';
import ArmyEditorStack from '@navigation/Builder/CreateArmyStack/ArmyEditorStack';
import BuilderEditV2 from '@navigation/Builder/BuilderEditV2/BuilderEditV2';
import BuilderHomeV2 from '@navigation/Builder/BuilderHome/BuilderHomeV2';
import { BuilderEditorProvider } from '@context/v2/BuilderEditorContext';

export type BuilderStackParamList = {
  BuilderHome: undefined;
  ArmyEditorStack: undefined;
  BuilderHomeV2: undefined;
  BuilderEdit: undefined;
  BuilderEditV2: {};
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
  const { t } = useTranslation('common');

  return (
    <BuilderEditorProvider>
      <Stack.Navigator
        initialRouteName="BuilderHomeV2"
        screenOptions={{
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
        }}>
        <Stack.Screen
          name="BuilderHome"
          component={BuilderHome}
          options={{
            headerShown: false,
            title: t('ArmyBuilder'),
          }}
        />
        <Stack.Screen
          name="BuilderHomeV2"
          component={BuilderHomeV2}
          options={{
            headerShown: false,
            title: t('ArmyBuilder'),
          }}
        />
        <Stack.Screen
          name="BuilderEditV2"
          component={BuilderEditV2}
          options={{
            headerShown: true,
            title: t('ArmyBuilder'),
          }}
        />
        <Stack.Screen
          name="BuilderEdit"
          component={BuilderEdit}
          options={{
            headerShown: true,
            title: t('ArmyBuilder'),
          }}
        />
        <Stack.Screen
          name="AddUnit"
          component={AddUnit}
          options={{
            headerShown: true,
            title: t('ArmyBuilder'),
          }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItem}
          options={{
            headerShown: true,
            title: 'Builder',
          }}
        />
        <Stack.Screen
          name="BuilderQuickView"
          component={BuilderQuickView}
          options={{
            headerShown: true,
            title: 'Builder',
          }}
        />
      </Stack.Navigator>
    </BuilderEditorProvider>
  );
};

export default BuilderStackNavigator;
