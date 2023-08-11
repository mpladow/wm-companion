import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconImageProps } from "./types";
import { FontAwesome5 } from '@expo/vector-icons';
const MonstrousMount = ({ size, color }: IconImageProps) => {
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
			<FontAwesome5 name='dragon' size={size} color='black' />
		</View>
	);
};

export default MonstrousMount;

const styles = StyleSheet.create({});
