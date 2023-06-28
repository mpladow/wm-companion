import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PlayerSection from "./components/PlayerSection";

const results = {
	Victory: "Victory",
	Defeat: "Defeat",
	Draw: "Draw",
};

export const Home = () => {
	const [playerOneScore, setPlayerOneScore] = useState<number>(1);
	const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);

	const incrementScore = (player: playerTypes) => {
		if (player == "playerOne") {
			setPlayerOneScore(playerOneScore + 1);
		} else {
			setPlayerTwoScore(playerTwoScore + 1);
		}
	};
	const decrementScore = (player: playerTypes) => {
		if (player == "playerOne") {
			setPlayerOneScore(playerOneScore - 1);
		} else {
			setPlayerTwoScore(playerTwoScore - 1);
		}
	};

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
				<View style={[{ justifyContent: "center" }, { transform: [{ rotate: "180deg" }] }]}>
					<Text>{combatResultPlayerTwo}</Text>
				</View>
				<View style={{ justifyContent: "center" }}>
					<Text>{combatResultPlayerOne}</Text>
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
