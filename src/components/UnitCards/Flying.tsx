import Wings from '@components/SVGS/Wings';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconImageProps } from './types';
import UnitIconContainer from './UnitIconContainer';

const Flying = ({ size = 20, color = 'black' }: IconImageProps) => {
  return (
    <UnitIconContainer isLeader={false}>
      <Wings width={size} height={size} />
    </UnitIconContainer>
  );
};

export default Flying;

const styles = StyleSheet.create({});
