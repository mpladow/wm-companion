import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@hooks/useTheme";

type MainContainerProps = {
	children: any;
};
const MainContainerWithBlankBG = ({ children }: MainContainerProps) => {
	const { theme } = useTheme();

	return <SafeAreaView style={{ flex: 1, backgroundColor: theme.black }}>{children}</SafeAreaView>;
};

export default MainContainerWithBlankBG;

const styles = StyleSheet.create({
	image: {
		flex: 1,
		justifyContent: "center",
		height: Dimensions.get("screen").height,
		position: "absolute",
		top: 0,
		width: Dimensions.get("screen").width,
	},
});
