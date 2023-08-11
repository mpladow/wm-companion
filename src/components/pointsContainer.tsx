import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";

type PointsContainerProps = {
	points?: number | string ;
};
const pointsContainer = ({ points }: PointsContainerProps) => {
	const { theme } = useTheme();
	return (
		<View
			style={{
				flex: 1,
				padding: 4,
				paddingHorizontal: 8,
				borderRadius: 4,
				backgroundColor: theme.white,
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<Text style={{ color: theme.black, fontSize: 12 }}>{points} points</Text>
		</View>
	);
};

export default pointsContainer;

const styles = StyleSheet.create({});
