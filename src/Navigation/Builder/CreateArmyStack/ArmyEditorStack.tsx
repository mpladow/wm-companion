import { StyleSheet, View } from 'react-native';
import React from 'react';
import ArmyCreationV2 from '../BuilderHome/components/CreateArmyModal/components/ArmyCreationV2';
import { useTheme } from '@hooks/useTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import { BuilderEditorProvider } from '@context/v2/BuilderEditorContext';

export type ArmyEditorStackParamList = {
  ArmyEditor: undefined;
};

const Stack = createNativeStackNavigator<ArmyEditorStackParamList>();

const ArmyEditorStack = () => {
  const { theme } = useTheme();
  const handleDismiss = () => {
    // navigate back and replace the stack.
  };
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerTitle: (props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText variant="heading3" size="xl">
              {props.children}
            </ThemedText>
          </View>
        ),
        headerBackTitleVisible: false,
        headerTintColor: theme.warning,
        headerShadowVisible: false,
        title: 'Create Army',
        headerStyle: { backgroundColor: theme.blueGrey },
      }}>
      <Stack.Screen name="ArmyEditor" component={ArmyCreationV2} />
    </Stack.Navigator>
  );
};

export default ArmyEditorStack;

const styles = StyleSheet.create({});
