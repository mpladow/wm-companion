import { Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Factions, playerTypes } from "@utils/constants";
import SectionDials from "./SectionDials";
import { Constants, Styling } from "@utils/index";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import { useVictoryPoints } from "@context/VPContext";
import { Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TrackerStackParamList } from "@navigation/Stacks/TrackerStackNavigator";
import { useBuilderContext } from "@context/BuilderContext";
import { useTranslation } from "react-i18next";

type PlayerSectionProps = {
	player: playerTypes;
	playerScore: number;
	playerCasualty: number;
	playerCombatBonus: number;
	handleSetPlayerScore: (player: playerTypes, score: number) => void;
	handleSetCasualty: (player: playerTypes, score: number) => void;
	handleSetCR: (player: playerTypes, score: number) => void;
	useOnePlayerMode?: boolean;
};
const PlayerSection = ({
	player,
	playerScore,
	playerCasualty,
	playerCombatBonus: playerCombatResult,
	handleSetCasualty,
	handleSetCR,
	useOnePlayerMode,
}: PlayerSectionProps) => {
	const { t } = useTranslation(["tracker", "home", "common"]);

	const { theme } = useTheme();
	const vpContext = useVictoryPoints();
	const navigation = useNavigation<NativeStackNavigationProp<TrackerStackParamList>>();
	// const [faction, setFaction] = useState<DropDownItemProps>();

	const incrementPlayerCasualty = () => {
		handleSetCasualty(player, playerCasualty + 1);
	};
	const decrementPlayerCasualty = () => {
		console.log(playerCasualty, "pc");
		handleSetCasualty(player, playerCasualty - 1);
	};
	const incrementPlayerCR = () => {
		handleSetCR(player, playerCombatResult + 1);
	};
	const decrementPlayerCR = () => {
		handleSetCR(player, playerCombatResult - 1);
	};
	const onVPPRess = () => {
		vpContext.setPlayer(player);
		navigation.navigate("VictoryPoints");
	};
	// get faction names and set that here

	// const handleNavigateToArmyList = () => {
	// 	const selectedArmyId = builder.userArmyLists[0].armyId;
	// 	builder.setSelectedArmyList(selectedArmyId);
	// 	navigation.navigate("MainTabs", {
	// 		screen: "ArmyBuilder",
	// 		params: {
	// 			screen: "BuilderEdit",
	// 		},
	// 	});
	// };
	return (
		<View style={{ flex: 1, flexDirection: "column" }}>

			<View
				style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#eaeae",
				}}
			>
				<View
					style={{
						flex: 1,
						position: "relative",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{/* <View style={{ borderRadius: 200, backgroundColor: theme.secondary, height: 70, width: 70 }}>
						<TouchableOpacity onPress={() => handleNavigateToArmyList()}>
							<View style={{ position: "absolute", top: "-10%", left: "28%" }}>
								<Foundation name='trophy' size={80} color='black' />
							</View>
							<Text style={{ fontSize: 28 }}>
								{player == "playerTwo" ? vpContext.getP2TotalPoints : vpContext.getP1TotalPoints}
							</Text>
						</TouchableOpacity>
					</View> */}
				</View>
				{/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<TouchableOpacity></TouchableOpacity>
				</View> */}
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text variant='heading1' style={{ fontSize: 70, color: theme.text }}>
						{playerScore}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						position: "relative",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View style={{ borderRadius: 200, backgroundColor: theme.secondary, height: 70, width: 70 }}>
						<TouchableOpacity onPress={() => onVPPRess()}>
							<View style={{ position: "absolute", top: "-10%", left: "28%" }}>
								<Foundation name='trophy' size={80} color='black' />
							</View>
							<Text style={{ fontSize: 28 }}>
								{player == "playerTwo" ? vpContext.getP2TotalPoints : vpContext.getP1TotalPoints}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<View style={{ flex: 1, flexDirection: "column" }}>
				<View style={{ justifyContent: "flex-end", alignItems: "center" }}>
					<Text variant='heading3' style={{ color: theme.text, fontSize: 16 }}>
						{t("CasualtiesInflicted")}
					</Text>
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
					<Text variant='heading3' style={{ color: theme.text, fontSize: 16 }}>
						{t("CombatBonuses")}
					</Text>
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
