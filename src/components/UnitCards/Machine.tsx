import { FontAwesome } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconImageProps } from "./types";


const Machine = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 40,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#e3d9bc",
				padding: 0,
			}}
		>
			<FontAwesome name='gear' size={size} color={color} />
		</View>
	);
};

export default Machine;

const styles = StyleSheet.create({});
