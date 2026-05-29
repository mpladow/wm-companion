import Catapult from "@components/SVGS/Catapult";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';

const Artillery = ({ size, color }: IconImageProps) => {
	return (
    <UnitIconContainer isLeader={false}>
      {/* <Spears width={size} height={size} color={color} /> */}
      <Catapult width={size} height={size} color={'black'} />
    </UnitIconContainer>
  );
};

export default Artillery;

const styles = StyleSheet.create({});
