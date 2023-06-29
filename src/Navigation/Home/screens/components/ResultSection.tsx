import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";

type ResultSectionProps = {
	resultOne?: ResultProps;
	resultTwo?: ResultProps;
};
const ResultSection = ({ resultOne, resultTwo }: ResultSectionProps) => {
	const { theme } = useTheme();

	const resultOneStyle = useMemo(() => {
		switch (resultOne?.result) {
			case "Victory":
				return theme.success;
			case "Draw":
				return theme.disabled;
			case "Defeat":
				return theme.error;
			default:
				break;
		}
	}, [resultOne]);
	const resultTwoStyle = useMemo(() => {
        console.log(resultTwo?.result, 'result')
		switch (resultTwo?.result) {
			case "Victory":
				return theme.success;
			case "Draw":
				return theme.disabled;
			case "Defeat":
				return theme.error;
			default:
				break;
		}
	}, [resultTwo]);
	return (
		<>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<View
					style={[{ justifyContent: "center", alignItems: "center" }, { transform: [{ rotate: "180deg" }] }]}
				>
					<Text style={{ fontSize: 18, color: resultOneStyle }}>
						{resultOne?.result} by {resultOne?.diff}
					</Text>
				</View>
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Text style={{ fontSize: 18, color: resultTwoStyle }}>
						{resultTwo?.result} by {resultTwo?.diff}
					</Text>
				</View>
			</View>
		</>
	);
};

export default ResultSection;

const styles = StyleSheet.create({});
