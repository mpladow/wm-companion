import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { IconImageProps } from "./types";


const General = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#fabb0c",
				padding: 0,
			}}
		>
			<FontAwesome name='star' size={size} color={color} />
		</View>
	);
};

export default General;

const styles = StyleSheet.create({});
