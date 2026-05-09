import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';


const Cavalry = ({ size = 20, color = "black" }: IconImageProps) => {
	return (
		<UnitIconContainer isLeader={false}		>
			<MaterialCommunityIcons name='horse-variant' size={size} color={color} />
		</UnitIconContainer>
	);
};

export default Cavalry;

const styles = StyleSheet.create({});
