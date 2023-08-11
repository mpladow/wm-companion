import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChariotIcon from "@components/SVGS/ChariotIcon";
import { IconImageProps } from "./types";

const Chariot = ({ size = 16, color = "black", isUpgrade }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: isUpgrade ? "#CDE6F5" : "#e3d9bc",
				padding: 0,
			}}
		>
			<ChariotIcon height={size} width={size} color={color} />
		</View>
	);
};

export default Chariot;

const styles = StyleSheet.create({});
