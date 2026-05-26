import { Text } from '@components/index';
import { useTheme } from '@hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type PointsContainerProps = {
  points?: number | string;
  maxPoints?: number | string;
};
const pointsContainer = ({ points, maxPoints }: PointsContainerProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        padding: 4,
        paddingHorizontal: 8,
        minWidth: 50,
        borderRadius: 4,
        backgroundColor: theme.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <Text bold style={{ color: theme.black, fontSize: 12 }}>
        {points}
        {maxPoints && `/${maxPoints}`}
      </Text>
      <Text style={{ color: theme.black, fontSize: 12 }}> pts</Text>
    </View>
  );
};

export default pointsContainer;

const styles = StyleSheet.create({});
