import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from '@expo/vector-icons';
import { IconImageProps } from "./types";


const Machine = ({ size, color }: IconImageProps) => {
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
			<FontAwesome name='gear' size={size} color={color} />
		</View>
	);
};

export default Machine;

const styles = StyleSheet.create({});
