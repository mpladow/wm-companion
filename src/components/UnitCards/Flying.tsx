import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Wings from "@components/SVGS/Wings";
import { IconImageProps } from "./types";


const Flying = ({ size = 20, color = "black" }: IconImageProps) => {
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
			<Wings width={size} height={size} />
		</View>
	);
};

export default Flying;

const styles = StyleSheet.create({});
