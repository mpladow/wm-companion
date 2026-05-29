import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconImageProps } from './types';
import UnitIconContainer from './UnitIconContainer';

const Machine = ({ size, color }: IconImageProps) => {
  return (
    <UnitIconContainer isLeader={false}>
      <FontAwesome name="gear" size={size} color={color} />
    </UnitIconContainer>
  );
};

export default Machine;

const styles = StyleSheet.create({});
