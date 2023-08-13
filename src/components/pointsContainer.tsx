import { StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import {Text} from '@components/index';

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
				justifyContent: 'center',
				flexDirection: 'row'
			}}
		>
			<Text bold style={{ color: theme.black, fontSize: 12 }}>{points}</Text><Text style={{color: theme.black, fontSize: 12}}> points</Text>
		</View>
	);
};

export default pointsContainer;

const styles = StyleSheet.create({});
