import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@hooks/useTheme";

type MainContainerProps = {
	children: any;
};
const MainContainerWithImage = ({ children }: MainContainerProps) => {
	const { theme } = useTheme();

	return (
		<ImageBackground source={require("../../assets/images/wmr_bg.png")} resizeMode='cover' style={[styles.image]}>
			<LinearGradient
				colors={["rgba(31,46,39, 0.4)", "rgba(6,9,7, 0.9)"]}
				start={{ y: 0, x: 0.5 }}
				end={{ y: 0.5, x: 0 }}
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: -0,
					height: Dimensions.get("screen").height,
					zIndex: 9,
				}}
			></LinearGradient>
			{children}
		</ImageBackground>
	);
};

export default MainContainerWithImage;

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
