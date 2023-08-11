import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spears from "@components/SVGS/Spears";
import { IconImageProps } from "./types";

const Infantry = ({ size, color }: IconImageProps) => {
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
			<Spears width={size} height={size} color={color} />
		</View>
	);
};

export default Infantry;

const styles = StyleSheet.create({});
