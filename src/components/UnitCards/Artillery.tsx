import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spears from "@components/SVGS/Spears";
import Catapult from "@components/SVGS/Catapult";
import { IconImageProps } from "./types";

const Artillery = ({ size, color }: IconImageProps) => {
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
			{/* <Spears width={size} height={size} color={color} /> */}
			<Catapult width={size} height={size} color={"black"} />
		</View>
	);
};

export default Artillery;

const styles = StyleSheet.create({});
