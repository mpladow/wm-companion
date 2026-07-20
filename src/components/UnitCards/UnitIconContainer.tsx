import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type UnitIconContainerProps = { isLeader: boolean; isUnique?: boolean } & PropsWithChildren;
const UnitIconContainer = ({ isLeader, isUnique = false, children }: UnitIconContainerProps) => {
  const backgroundColor = useMemo(() => {
    if (isUnique) {
      return '#a5b6e2';
    }
    if (isLeader) {
      return '#fabb0c';
    }
    return '#e3d9bc';
  }, []);
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: 'white',
        width: 28,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        padding: 0,
      }}>
      {children}
    </View>
  );
};

export default UnitIconContainer;

const styles = StyleSheet.create({});
