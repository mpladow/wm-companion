import { FontAwesome } from '@expo/vector-icons';
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';


const Hero = ({ size, color }: IconImageProps) => {
	return (
    <UnitIconContainer isLeader={true}>
      <FontAwesome name="star-half-empty" size={size} color={color} />
      {/* <Entypo name='star' size={size} color={color} /> */}
    </UnitIconContainer>
  );
};

export default Hero;

const styles = StyleSheet.create({});
