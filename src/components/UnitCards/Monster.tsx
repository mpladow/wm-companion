import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spears from "@components/SVGS/Spears";
import MonsterIcon from "@components/SVGS/MonsterIcon";
import { IconImageProps } from "./types";

const Monster = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#e3d9bc",
				padding: 0,
                paddingTop: 8
			}}
		>
            <MonsterIcon height={size} width={size} color={color}/>
		</View>
	);
};

export default Monster;

const styles = StyleSheet.create({});
