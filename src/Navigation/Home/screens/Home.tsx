import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { playerTypes } from "@/utils/constants";
import PlayerSection from "./components/PlayerSection";
import ResultSection from "./components/ResultSection";

const results = {
	Victory: "Victory",
	Defeat: "Defeat",
	Draw: "Draw",
};

export const Home = () => {
	const [playerOneScore, setPlayerOneScore] = useState<number>(1);
	const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);

	const combatResultPlayerOne = useMemo(() => {
		if (playerOneScore > playerTwoScore) {
			return results.Victory;
		}
		if (playerOneScore == playerTwoScore) {
			return results.Draw;
		}
		if (playerOneScore < playerTwoScore) {
			return results.Defeat;
		}
		return;
	}, [playerOneScore, playerTwoScore]);

	const combatResultPlayerTwo = useMemo(() => {
		if (playerOneScore > playerTwoScore) {
			return results.Defeat;
		}
		if (playerOneScore == playerTwoScore) {
			return results.Draw;
		}
		if (playerOneScore < playerTwoScore) {
			return results.Victory;
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
				/>
			</View>
			<View>
				<ResultSection resultOne={combatResultPlayerOne} resultTwo={combatResultPlayerTwo} />
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
					handleSetPlayerScore={(player, score) => handleSetPlayerScore(player, score)}
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
