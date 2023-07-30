import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import constants, { margin, Pages, playerTypes, results } from "@utils/constants";
import { PlayerSection, ResultSection } from "./components";
import CentreSection from "./components/CentreSection";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../HomeStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useVictoryPoints } from "@context/VPContext";

export type PlayerDetailsProps = {
	player: playerTypes;
	score?: VPScoreProps[];
	faction?: string;
};
export type VPScoreProps = {
	sourceName: string;
	sourcePoints: string;
	isUnit: boolean; // if false, the source comes from victory points
	isItem: boolean;
	attachedItems?: VPScoreProps[];
};

export type DropDownItemProps = {
	label: string;
	value: string | number;
};

export const Home = () => {
	const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
	const theme = useTheme();
	const vpContext = useVictoryPoints();

	const [playerOneScore, setPlayerOneScore] = useState<number>(1);
	const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);
	const [p1CasualtyScore, setP1CasualtyScore] = useState<number>(0);
	const [p2CasualtyScore, setP2CasualtyScore] = useState<number>(0);
	const [p1CombatBonus, setP1CombatBonus] = useState<number>(0);
	const [p2CombatBonus, setP2CombatBonus] = useState<number>(0);

	const combatResultTop = useMemo(() => {
		const diff = playerOneScore - playerTwoScore;
		const diffConverted = Math.abs(diff);

		if (diff > 0) {
			return { result: results.Victory, diff: diffConverted } as ResultProps;
		}
		if (diff == 0) {
			return { result: results.Draw, diff: diffConverted } as ResultProps;
		}
		if (diff < 0) {
			return { result: results.Defeat, diff: diffConverted } as ResultProps;
		}
		return;
	}, [playerOneScore, playerTwoScore]);

	const combatResultBottom = useMemo(() => {
		const diff = playerTwoScore - playerOneScore;
		const diffConverted = Math.abs(diff);
		if (diff > 0) {
			return { result: results.Victory, diff: diffConverted } as ResultProps;
		}
		if (diff == 0) {
			return { result: results.Draw, diff: diffConverted } as ResultProps;
		}
		if (diff < 0) {
			return { result: results.Defeat, diff: diffConverted } as ResultProps;
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
	const onSettingsPress = () => {
		navigation.navigate("Settings");
		// setPage(Pages.Settings);
		// setModalVisible(true);
	};
	const onBlunderPress = () => {
		navigation.navigate("Blunders");

		// setPage(Pages.Blunders);
		// setModalVisible(true);
	};
	const onVictoryPointsPress = (player?: playerTypes) => {
		// this needs to be udpates to
		vpContext.setPlayer("playerOne");
		navigation.navigate("VictoryPoints");
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
					{
						transform: [{ rotate: "180deg" }],
						justifyContent: "space-between",
						flexDirection: "row",
						backgroundColor: theme.theme.backgroundVariant,
					},
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
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					flexGrow: 0.2,
					paddingHorizontal: margin * 3,
					backgroundColor: theme.theme.backgroundVariant2,
					overflow: "visible",
				}}
			>
				<CentreSection
					handleSettingsPress={onSettingsPress}
					handleBlunderPress={onBlunderPress}
					handleVictoryPointsPress={onVictoryPointsPress}
					handleReset={handleReset}
					topResultValue={combatResultTop}
					bottomResultValue={combatResultBottom}
					// add plauyer one score object
					//add player two score object
				/>
			</View>
			<View
				style={[
					styles.container,
					{
						zIndex: -5,
						justifyContent: "space-between",
						flexDirection: "row",
						backgroundColor: theme.theme.background,
					},
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
