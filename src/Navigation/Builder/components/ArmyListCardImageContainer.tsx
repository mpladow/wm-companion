import { ImageSourcePropType, StyleSheet, Image, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
type ArmyListCardImageContainerProps = {
	imageSource: ImageSourcePropType;
	isFavourite: boolean;
};
const ArmyListCardImageContainer = ({ imageSource, isFavourite }: ArmyListCardImageContainerProps) => {
	const { theme } = useTheme();
	return (
		<View style={{ position: "absolute", top: 0, borderLeftColor: isFavourite? theme.warning : theme.white, borderLeftWidth: 4 }}>
			<Image style={[styles.stretch]} source={imageSource} />
		</View>
	);
};

export default ArmyListCardImageContainer;

const styles = StyleSheet.create({
	stretch: {
		width: 120,
		height: 150,
		resizeMode: "cover",
	},
});
