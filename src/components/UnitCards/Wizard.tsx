import { FontAwesome5 } from '@expo/vector-icons';
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';


const Wizard = ({ size, color, containerSize=24 }: IconImageProps) => {
	return (
		<UnitIconContainer isLeader={true}>
		
			<FontAwesome5 name='hat-wizard' size={size} color={color} />
			{/* <Entypo name='star' size={size} color={color} /> */}
		</UnitIconContainer>
	);
};

export default Wizard;

const styles = StyleSheet.create({});
