import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ResultSection from "./ResultSection";
import Button from "@components/button";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";

type CentreSectionProps = {
	handleReset: () => void;
	topResultValue?: ResultProps;
	bottomResultValue?: ResultProps;
};
const CentreSection = ({ handleReset, topResultValue, bottomResultValue }: CentreSectionProps) => {
	const { theme } = useTheme();
	return (
		<>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
				<Button onPress={handleReset} variant={"default"}>
					<Text style={{ color: theme.text }}>Reset</Text>
				</Button>
			</View>
			<ResultSection resultOne={bottomResultValue} resultTwo={topResultValue} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
				<Ionicons name='settings-outline' size={24} color={theme.text} />
			</View>
		</>
	);
};

export default CentreSection;

const styles = StyleSheet.create({});
