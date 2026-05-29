import { useTheme } from '@hooks/useTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import BuilderCreationStackNavigator from './BuilderCreationStack';
import TabStackNavigator from './TabStackNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
  TrackerStackNavigator: undefined;
  BuilderCreationStackNavigator: undefined;
};
const Root = createNativeStackNavigator<RootStackParamList>();
const RootStack = () => {
  const { theme } = useTheme();
  return (
    <Root.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: { backgroundColor: theme.blueGrey },
      }}>
      <Root.Group screenOptions={{ headerShown: false }}>
        <Root.Screen component={TabStackNavigator} name="MainTabs" />
        {/* <Root.Screen component={TrackerStackNavigator} name='TrackerStackNavigator' /> */}
      </Root.Group>
      <Root.Screen
        component={BuilderCreationStackNavigator}
        name="BuilderCreationStackNavigator"
        options={{ headerShown: false, headerBackTitleVisible: false, presentation: 'modal' }}
      />
    </Root.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
