import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconImageProps } from "./types";
import MagicOrb from "@components/SVGS/MagicOrb";

const DeviceOfPower = ({ size, color }: IconImageProps) => {
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
			<MagicOrb width={size} height={size} color={color} />
		</View>
	);
};

export default DeviceOfPower;

const styles = StyleSheet.create({});
