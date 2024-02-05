import { StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Text } from "@components/index";

type StatContainerProps = {
	statName: string;
	statValue?: string | number;
};
const StatContainer = ({ statName, statValue }: StatContainerProps) => {
	const { theme } = useTheme();
	const STAT_FONT_SIZE = 22;

	return (
		<>
			<Text style={{ textAlign: "center" }}>{statName}</Text>
			<View
				style={[
					{
						borderRadius: 2,
						marginTop: 4,
						backgroundColor: theme.white,
						padding: 4,
						minWidth: 40,
						minHeight: 40,
						alignItems: "center",
						justifyContent: "center",
						borderColor: theme.background,
						borderWidth: 1,
						// borderTopColor: theme.white,
						// borderRightColor: theme.white,
					},
					// {
					// 	borderWidth: 1,
					// 	shadowColor: "white",
					// 	shadowOffset: {
					// 		width: 4,
					// 		height: -4,
					// 	},
					// 	shadowOpacity: 1,
					// 	shadowRadius: 0,
					// 	elevation: -10,
					// },
				]}
			>
				<Text bold style={{ textAlignVertical: "center", color: theme.textInverted, fontSize: STAT_FONT_SIZE }}>
					{statValue}
				</Text>
			</View>
		</>
	);
};

export default StatContainer;

const styles = StyleSheet.create({
	boxShadow: {
		borderColor: "green",
		borderWidth: 1,
		shadowColor: "white",
		shadowOffset: {
			width: 4,
			height: -4,
		},
		shadowOpacity: 1,
		shadowRadius: 0,
		elevation: -10,
	},
});
