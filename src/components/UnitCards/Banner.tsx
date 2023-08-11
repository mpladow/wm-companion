import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconImageProps } from "./types";

const Banner = ({ size, color }: IconImageProps) => {
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
			<AntDesign name='flag' size={size} color={color} />
		</View>
	);
};

export default Banner;

const styles = StyleSheet.create({});
