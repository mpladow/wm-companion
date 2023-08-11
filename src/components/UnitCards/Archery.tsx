import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconImageProps } from "./types";


const Archery = ({ size, color }: IconImageProps) => {
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
			<MaterialCommunityIcons name='bow-arrow' size={size} color={color} />
		</View>
	);
};

export default Archery;

const styles = StyleSheet.create({});
