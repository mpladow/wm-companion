import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { playerTypes } from "@utils/constants";
import SectionDials from "./SectionDials";
import { Constants, Styling } from "@utils/index";
import { useTheme } from "@hooks/useTheme";

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
	playerCasualty,
	playerCombatBonus: playerCombatResult,
	handleSetCasualty,
	handleSetCR,
}: PlayerSectionProps) => {
	const { theme } = useTheme();
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
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eaeae" }}>
				<Text style={{ fontSize: 50, color: theme.text }}>{playerScore}</Text>
			</View>

			<View style={{ flex: 1, flexDirection: "column" }}>
				<View style={{ justifyContent: "flex-end", alignItems: "center" }}>
					<Text style={{ color: theme.text }}>Casualties Inflicted</Text>
				</View>
				<SectionDials
					textSize={Styling.xxl}
					direction={"row"}
					onLeftButtonPress={() => decrementPlayerCasualty()}
					onRightButtonPress={() => incrementPlayerCasualty()}
					value={playerCasualty}
				/>
			</View>
			<View style={{ flex: 1, flexDirection: "column" }}>
				<View style={{ justifyContent: "flex-end", alignItems: "center" }}>
                <Text style={{ color: theme.text }}>Combat Bonuses</Text>
				</View>
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
