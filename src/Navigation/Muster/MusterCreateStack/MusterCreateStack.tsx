import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MusterCreationForm from './MusterCreationForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import ThemedText from '@components/ThemedText.tsx/ThemedText';

type MusterCreateStackParamList = {
  MusterCreationForm: undefined;
};
const Stack = createNativeStackNavigator<MusterCreateStackParamList>();
const MusterCreateStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator initialRouteName="MusterCreationForm">
      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="MusterCreationForm"
          component={MusterCreationForm}
          options={{
            presentation: 'modal', // iOS only: full-screen modal
            title: 'Create Army', // Optional title
            // Customize appearance here
            contentStyle: {
              backgroundColor: 'transparent', // Example: Transparent background
            },
            headerStyle: {
              backgroundColor: theme.backgroundVariant,
            },
            headerTitle: (props) => (
              <View style={{ flexDirection: 'row', backgroundColor: theme.backgroundVariant }}>
                <ThemedText variant="heading3" size="xl">
                  {props.children}
                </ThemedText>
              </View>
            ),
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MusterCreateStack;

const styles = StyleSheet.create({});
