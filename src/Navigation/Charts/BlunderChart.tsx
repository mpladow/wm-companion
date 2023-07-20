import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { Text } from "@components/index";
import { margin } from "@utils/constants";

const BlunderChart = () => {
	const { theme } = useTheme();
	return (
		<View style={{ display: "flex", flex: 1 }}>
			<View>
				<Text style={{ fontSize: Styling.xl, fontWeight: "bold" }}>WMR Combat Calculator</Text>
			</View>
		</View>
	);
};

export default BlunderChart;

