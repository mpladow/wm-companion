import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

type UnitIconContainerProps = { isLeader: boolean } & PropsWithChildren;
const UnitIconContainer = ({ isLeader, children }: UnitIconContainerProps) => {
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: 'white',
        width: 28,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isLeader ? '#fabb0c' : '#e3d9bc',
        padding: 0,
      }}>
      {children}
    </View>
  );
};

export default UnitIconContainer;

const styles = StyleSheet.create({});
