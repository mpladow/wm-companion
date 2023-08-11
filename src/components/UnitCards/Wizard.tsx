import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from '@expo/vector-icons';
import { IconImageProps } from "./types";


const Wizard = ({ size, color, containerSize=24 }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#e3d9bc",
				padding: 0,
			}}
		>
			<FontAwesome5 name='hat-wizard' size={size} color={color} />
			{/* <Entypo name='star' size={size} color={color} /> */}
		</View>
	);
};

export default Wizard;

const styles = StyleSheet.create({});
