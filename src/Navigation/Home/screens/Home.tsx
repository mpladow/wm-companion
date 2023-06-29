import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { playerTypes } from "@Utils/constants";
import { PlayerSection, ResultSection } from "./components";
import Button from "@Components/button";
// import PlayerSection from "./components/PlayerSection";
// import ResultSection from "./components/ResultSection";

export const results = {
	Victory: "Victory",
	Defeat: "Defeat",
	Draw: "Draw",
};

export type ResultProps = {
	result: string;
	diff: number;
};

export const Home = () => {
	const [playerOneScore, setPlayerOneScore] = useState<number>(1);
	const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);
	const [p1CasualtyScore, setP1CasualtyScore] = useState<number>(0);
	const [p2CasualtyScore, setP2CasualtyScore] = useState<number>(0);
	const [p1CombatBonus, setP1CombatBonus] = useState<number>(0);
	const [p2CombatBonus, setP2CombatBonus] = useState<number>(0);

	const combatResultPlayerOne = useMemo(() => {
		const diff = playerOneScore - playerTwoScore;
		if (diff > 0) {
			return { result: results.Victory, diff: diff } as ResultProps;
		}
		if (diff == 0) {
			return { result: results.Draw, diff: diff } as ResultProps;
		}
		if (diff < 0) {
			return { result: results.Defeat, diff: diff } as ResultProps;
		}
		return;
	}, [playerOneScore, playerTwoScore]);

	const combatResultPlayerTwo = useMemo(() => {
		const diff = playerTwoScore - playerOneScore;
		if (diff > 0) {
			return { result: results.Victory, diff: diff } as ResultProps;
		}
		if (diff == 0) {
			return { result: results.Draw, diff: diff } as ResultProps;
		}
		if (diff < 0) {
			return { result: results.Defeat, diff: diff } as ResultProps;
		}
		return;
	}, [playerOneScore, playerTwoScore]);

	const handleSetPlayerScore = (player: playerTypes, score: number) => {
		if (player == "playerOne") {
			setPlayerOneScore(score);
		} else {
			setPlayerTwoScore(score);
		}
	};
	useEffect(() => {
		setPlayerOneScore(p1CasualtyScore + p1CombatBonus);
	}, [p1CasualtyScore, p1CombatBonus]);
	useEffect(() => {
		setPlayerTwoScore(p2CasualtyScore + p2CombatBonus);
	}, [p2CasualtyScore, p2CombatBonus]);

	const handleSetPlayerCasualty = (player: playerTypes, score: number) => {
		if (player == "playerOne") {
			setP1CasualtyScore(score);
		} else {
			setP2CasualtyScore(score);
		}
	};
	const handleSetPlayerCombatBonus = (player: playerTypes, score: number) => {
		if (player == "playerOne") {
			setP1CombatBonus(score);
		} else {
			setP2CombatBonus(score);
		}
	};

	const handleReset = () => {
		setP1CasualtyScore(0);
		setP2CasualtyScore(0);
		setP1CombatBonus(0);
		setP2CombatBonus(0);
	};

	return (
		<View style={{ flex: 1 }}>
			<View
				style={[
					styles.container,
					{ transform: [{ rotate: "180deg" }], justifyContent: "space-between", flexDirection: "row" },
				]}
			>
				<PlayerSection
					player={"playerTwo"}
					playerScore={playerTwoScore}
					handleSetPlayerScore={(player, score) => handleSetPlayerScore(player, score)}
					playerCasualty={p2CasualtyScore}
					playerCombatBonus={p2CombatBonus}
					handleSetCasualty={(player, score) => handleSetPlayerCasualty(player, score)}
					handleSetCR={(player, score) => handleSetPlayerCombatBonus(player, score)}
				/>
			</View>
			<View style={{ flex: 1, flexDirection: "row", flexGrow: 0.2, paddingHorizontal: 8 }}>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
					<Button
						onPress={handleReset}
						variant={"default"}
					><Text>Reset</Text></Button>
				</View>
				<ResultSection resultOne={combatResultPlayerOne} resultTwo={combatResultPlayerTwo} />
				<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
					<Text>TEST</Text>
				</View>
			</View>
			<View
				style={[
					styles.container,
					{ justifyContent: "space-between", flexDirection: "row", backgroundColor: "green" },
				]}
			>
				<PlayerSection
					player={"playerOne"}
					playerScore={playerOneScore}
					playerCasualty={p1CasualtyScore}
					playerCombatBonus={p1CombatBonus}
					handleSetPlayerScore={(player, score) => handleSetPlayerScore(player, score)}
					handleSetCasualty={(player, score) => handleSetPlayerCasualty(player, score)}
					handleSetCR={(player, score) => handleSetPlayerCombatBonus(player, score)}
				/>
			</View>
			<StatusBar style='auto' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		padding: 14,
	},
});
