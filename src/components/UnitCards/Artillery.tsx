import Catapult from "@components/SVGS/Catapult";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconImageProps } from "./types";

const Artillery = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 40,
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
