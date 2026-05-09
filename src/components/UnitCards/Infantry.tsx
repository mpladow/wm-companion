import Spears from "@components/SVGS/Spears";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';

const Infantry = ({ size, color }: IconImageProps) => {
	return (
		<UnitIconContainer isLeader={false}		>
			<Spears width={size} height={size} color={color} />
		</UnitIconContainer>
	);
};

export default Infantry;

const styles = StyleSheet.create({});
