import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ResultProps } from "../Home";

type ResultSectionProps = {
	resultOne?: ResultProps;
	resultTwo?: ResultProps;
};
const ResultSection = ({ resultOne, resultTwo }: ResultSectionProps) => {
	return (
		<>
			<View style={{alignItems: 'center', 'justifyContent': 'center'}}>
				<View
					style={[{ justifyContent: "center", alignItems: "center" }, { transform: [{ rotate: "180deg" }] }]}
				>
					<Text style={{ fontSize: 18 }}>
						{resultTwo?.result} by {resultTwo?.diff}
					</Text>
				</View>
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Text style={{ fontSize: 18 }}>
						{resultOne?.result} by {resultOne?.diff}
					</Text>
				</View>
			</View>
		</>
	);
};

export default ResultSection;

const styles = StyleSheet.create({});
