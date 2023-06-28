import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { playerTypes } from "@/utils/constants";

type PlayerSectionProps = {
	player: playerTypes;
	playerScore: number;
	handleSetPlayerScore: (player: playerTypes, score: number) => void;
};

const PlayerSection = ({ player, playerScore, handleSetPlayerScore }: PlayerSectionProps) => {
	const incrementScore = () => {
		handleSetPlayerScore(player, playerScore + 1);
	};
	const decrementScore = () => {
		handleSetPlayerScore(player, playerScore - 1);
	};

	return (
		<>
			<View style={{ flex: 1, padding: 8 }}>
				<Button onPress={() => decrementScore()} title={"-"} />
			</View>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 50 }}>{playerScore}</Text>
			</View>
			<View style={{ flex: 1, padding: 8 }}>
				<Button onPress={() => incrementScore()} title={"+"} />
			</View>
		</>
	);
};

export default PlayerSection;

