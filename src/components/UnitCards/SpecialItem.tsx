import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { IconImageProps } from "./types";
import { MaterialIcons } from "@expo/vector-icons";

const SpecialItem = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#CDE6F5",
				padding: 0,
			}}
		>
			<MaterialIcons name='stars' size={size} color={color} />
		</View>
	);
};

export default SpecialItem;

const styles = StyleSheet.create({});
