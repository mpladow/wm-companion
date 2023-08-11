import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconImageProps } from "./types";


const Cavalry = ({ size = 20, color = "black" }: IconImageProps) => {
	return (
		<View
			style={{
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#e3d9bc",
				width: 28,
				height: 28,
			}}
		>
			<MaterialCommunityIcons name='horse-variant' size={size} color={color} />
		</View>
	);
};

export default Cavalry;

const styles = StyleSheet.create({});
