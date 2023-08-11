import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconImageProps } from "./types";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MagicWeapon = ({ size, color }: IconImageProps) => {
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
			<MaterialCommunityIcons name='sword' size={size} color={color} />
		</View>
	);
};

export default MagicWeapon;

const styles = StyleSheet.create({});
