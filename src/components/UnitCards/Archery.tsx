import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconImageProps } from './types';
import UnitIconContainer from './UnitIconContainer';

const Archery = ({ size, color, isUnique }: IconImageProps) => {
  return (
    <UnitIconContainer isLeader={false} isUnique={isUnique}>
      <MaterialCommunityIcons name="bow-arrow" size={size} color={color} />
    </UnitIconContainer>
  );
};

export default Archery;

const styles = StyleSheet.create({});
