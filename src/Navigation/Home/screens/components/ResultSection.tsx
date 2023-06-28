import { StyleSheet, Text, View } from "react-native";
import React from "react";

type ResultSectionProps = {
	resultOne?: string;
	resultTwo?: string;
};
const ResultSection = ({ resultOne, resultTwo }: ResultSectionProps) => {
	return (
		<>
			<View style={[{ justifyContent: "center", alignItems: "center" }, { transform: [{ rotate: "180deg" }] }]}>
				<Text style={{ fontSize: 18 }}>{resultOne}</Text>
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 18 }}>{resultTwo}</Text>
			</View>
		</>
	);
};

export default ResultSection;

const styles = StyleSheet.create({});
