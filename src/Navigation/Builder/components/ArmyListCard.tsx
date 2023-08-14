import { StyleSheet, TouchableOpacity, View, Image, Dimensions } from "react-native";
import React, { useRef, useState } from "react";
import { ArmyListProps, BuilderContextProvider } from "@context/BuilderContext";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import { Factions } from "@utils/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import PointsContainer from "@components/pointsContainer";
import { FontAwesome } from "@expo/vector-icons";
import MenuOptionButton from "@components/MenuOptionButton";
import { LinearGradient } from "expo-linear-gradient";
import { Foundation } from "@expo/vector-icons";
type ArmyListCardProps = {
	armyList: ArmyListProps;
	handleArmyListPress: (armyId: string) => void;
	handleDeleteArmyPress: (armyId: string) => void;
	handleArmyNameChange: (armyId: string) => void;
	handleToggleFavourite: (armyId: string) => void;
	handleOpenArmyNotes: () => void;
};
const ArmyListCard = ({
	armyList,
	handleArmyListPress,
	handleDeleteArmyPress,
	handleArmyNameChange,
	handleToggleFavourite,
	handleOpenArmyNotes,
}: ArmyListCardProps) => {
	const menuRef = useRef(null);
	const { theme } = useTheme();

	const setImage = () => {
		// if (armyList.faction == Factions.Chaos)
		// 	return (
		// 		<View style={{ position: "absolute", top: 0, borderLeftColor: theme.white, borderLeftWidth: 4 }}>
		// 			<Image style={[styles.stretch]} source={require("../../../../assets/images/wm_chaos.png")} />
		// 		</View>
		// 	);
		// if (armyList.faction == Factions.Empire)
		// 	return (
		// 		<View style={{ position: "absolute", top: 0, borderLeftColor: theme.white, borderLeftWidth: 4 }}>
		// 			<Image style={[styles.stretch]} source={require("../../../../assets/images/wm-empire.png")} />
		// 		</View>
		// 	);
		return (
			<View style={{ position: "absolute", top: 0, borderLeftColor: theme.white, borderLeftWidth: 4 }}>
				<Image style={[styles.stretch]} source={require("../../../../assets/images/wm-genericarmy-2.png")} />
			</View>
		);
	};

	return (
		<TouchableOpacity onPress={() => handleArmyListPress(armyList.armyId)}>
			<View
				style={{ overflow: "hidden", backgroundColor: theme.background, borderRadius: 8, flexDirection: "row" }}
			>
				<View style={{ flex: 3, margin: 20 }}>
					<View style={{ marginBottom: 4 }}>
						<Text variant='heading3' style={{ fontSize: 24 }}>
							{armyList.name}
						</Text>
					</View>

					<View style={{ marginBottom: 4 }}>
						<Text>{Object.keys(Factions)[armyList.faction - 1]?.replaceAll("_", " ")}</Text>
					</View>
					<View style={{ alignItems: "flex-start", flexDirection: "row" }}>
						<View>
							<PointsContainer points={armyList.points} />
						</View>
						{armyList.armyNotes !== "" && armyList.armyNotes !== undefined ? (
							<TouchableOpacity style={{ marginLeft: 12 }} onPress={() => handleOpenArmyNotes()}>
								<Foundation name='clipboard-notes' size={24} color={theme.white} />
							</TouchableOpacity>
						) : null}
					</View>
				</View>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
					{/* <View style={{ position: "absolute", top: 0, borderLeftColor: theme.white, borderLeftWidth: 4 }}>
						<Image
							style={[styles.stretch]}
							source={require("../../../../assets/images/wm-genericarmy-2.png")}
						/>
					</View> */}
					{setImage()}
					<LinearGradient
						colors={["rgba(31,46,39, 0.9)", "rgba(6,9,7, 0.0)"]}
						start={{ y: 0, x: 1 }}
						end={{ y: 0, x: 0 }}
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: -0,
							width: 120,
							height: 300,
							zIndex: 9,
						}}
					></LinearGradient>
					<Menu style={{ zIndex: 99 }}>
						<MenuTrigger>
							<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
						</MenuTrigger>
						<MenuOptions optionsContainerStyle={{ borderRadius: 8, maxWidth: 170 }}>
							<MenuOption onSelect={() => handleToggleFavourite(armyList.armyId)}>
								<MenuOptionButton
									icon={<AntDesign name='star' size={18} color={theme.warning} />}
									variant={"outline"}
									ButtonText={armyList.isFavourite ? "Remove Favourite" : "Set Favourite"}
								/>
							</MenuOption>
							<MenuOption onSelect={() => handleArmyNameChange(armyList.armyId)}>
								<View style={{ flexDirection: "row", padding: 8 }}>
									<FontAwesome name='pencil' size={18} color='black' />
									<View style={{ marginLeft: 8 }}>
										<Text style={{ color: theme.black }}>Edit</Text>
									</View>
								</View>
							</MenuOption>
							<MenuOption onSelect={() => handleDeleteArmyPress(armyList.armyId)}>
								<MenuOptionButton
									icon={<AntDesign name='delete' size={18} color={theme.white} />}
									variant={"danger"}
									ButtonText={"Delete"}
								/>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ArmyListCard;

const styles = StyleSheet.create({
	stretch: {
		width: 120,
		height: 150,
		resizeMode: "cover",
	},
});
