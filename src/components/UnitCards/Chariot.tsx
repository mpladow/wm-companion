import ChariotIcon from "@components/SVGS/ChariotIcon";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';

const Chariot = ({ size = 16, color = "black", isUpgrade }: IconImageProps) => {
	return (
		<UnitIconContainer isLeader={false}		>
			<ChariotIcon height={size} width={size} color={color} />
		</UnitIconContainer>
	);
};

export default Chariot;

const styles = StyleSheet.create({});
