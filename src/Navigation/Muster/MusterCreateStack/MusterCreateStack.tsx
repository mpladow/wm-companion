import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type MusterCreateStackParamList = {
  MusterCreationForm: undefined;
};
const Stack = createNativeStackNavigator<MusterCreateStackParamList>();
const MusterCreateStack = () => {
  return (
    <Stack.Navigator initialRouteName="MusterCreationForm">
      <Text>MusterCreateStack</Text>
    </Stack.Navigator>
  );
};

export default MusterCreateStack;

const styles = StyleSheet.create({});
