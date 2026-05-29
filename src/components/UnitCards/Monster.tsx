import MonsterIcon from "@components/SVGS/MonsterIcon";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';

const Monster = ({ size, color }: IconImageProps) => {
	return (
    <UnitIconContainer isLeader={false}>
      <MonsterIcon style={{marginTop: 6}} height={size} width={size} color={color} />
    </UnitIconContainer>
  );
};

export default Monster;

const styles = StyleSheet.create({});
