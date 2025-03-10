import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabStackNavigator from './TabStackNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackerStackNavigator from './TrackerStackNavigator';
import { useTheme } from '@hooks/useTheme';
import ArmyEditorStack from '@navigation/Builder/CreateArmyStack/ArmyEditorStack';
import { useTranslation } from 'react-i18next';

export type RootStackParamList = {
  MainTabs: undefined;
  ArmyEditorStack: undefined;
  TrackerStackNavigator: undefined;
};
const Root = createNativeStackNavigator<RootStackParamList>();
const RootStack = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <Root.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: { backgroundColor: theme.blueGrey },
      }}>
      <Root.Group screenOptions={{ headerShown: false }}>
        <Root.Screen component={TabStackNavigator} name="MainTabs" />
        {/* // publ;ic screens */}
        <Root.Screen
          name="ArmyEditorStack"
          component={ArmyEditorStack}
          options={{
            headerShown: false,
            title: t('ArmyBuilder'),
          }}
        />
        {/* <Root.Screen component={TrackerStackNavigator} name='TrackerStackNavigator' /> */}
      </Root.Group>
    </Root.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
