import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconImageProps } from "./types";
import { FontAwesome5 } from "@expo/vector-icons";
import Saddle from "@components/SVGS/Saddle";
const Mount = ({ size, color }: IconImageProps) => {
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
			<Saddle width={size} height={size} color={color} />
		</View>
	);
};

export default Mount;

const styles = StyleSheet.create({});
