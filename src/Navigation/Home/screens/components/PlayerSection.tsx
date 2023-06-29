import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { playerTypes } from "@Utils/constants";
import SectionDials from "./SectionDials";
import { Constants, Styling } from "@Utils/index";

type PlayerSectionProps = {
	player: playerTypes;
	playerScore: number;
	playerCasualty: number;
	playerCombatBonus: number;
	handleSetPlayerScore: (player: playerTypes, score: number) => void;
	handleSetCasualty: (player: playerTypes, score: number) => void;
	handleSetCR: (player: playerTypes, score: number) => void;
};

const PlayerSection = ({
	player,
	playerScore,
	handleSetPlayerScore,
	playerCasualty,
	playerCombatBonus: playerCombatResult,
	handleSetCasualty,
	handleSetCR,
}: PlayerSectionProps) => {
	const incrementScore = () => {
		handleSetPlayerScore(player, playerScore + 1);
	};
	const decrementScore = () => {
		handleSetPlayerScore(player, playerScore - 1);
	};
	const incrementPlayerCasualty = () => {
		handleSetCasualty(player, playerCasualty + 1);
	};
	const decrementPlayerCasualty = () => {
		handleSetCasualty(player, playerCasualty - 1);
	};
	const incrementPlayerCR = () => {
		handleSetCR(player, playerCombatResult + 1);
	};
	const decrementPlayerCR = () => {
		handleSetCR(player, playerCombatResult - 1);
	};

	return (
		<View style={{ flex: 1, flexDirection: "column" }}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eaeaea" }}>
				<Text style={{ fontSize: 50 }}>{playerScore}</Text>
			</View>
			<SectionDials
				textSize={Styling.xxl}
				direction={"row"}
				onLeftButtonPress={() => decrementPlayerCasualty()}
				onRightButtonPress={() => incrementPlayerCasualty()}
				value={playerCasualty}
			/>
			<View style={{ flex: 1, flexDirection: "row" }}>
				<SectionDials
					direction={"row"}
					onLeftButtonPress={() => decrementPlayerCR()}
					onRightButtonPress={() => incrementPlayerCR()}
					value={playerCombatResult}
					textSize={Styling.xl}
				/>
			</View>
		</View>
	);
};

export default PlayerSection;
