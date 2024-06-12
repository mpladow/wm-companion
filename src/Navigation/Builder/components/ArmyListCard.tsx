import { StyleSheet, TouchableOpacity, View, Image, Pressable } from "react-native";
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
import { useTranslation } from "react-i18next";
import ArmyListCardImageContainer from "./ArmyListCardImageContainer";
import { getKeyByValue, getLocalFactionAssets } from "@utils/factionHelpers";
import Constants from "expo-constants";
type ArmyListCardProps = {
	armyList: ArmyListProps;
	handleArmyListPress: (armyId: string) => void;
	handleDeleteArmyPress: (armyId: string) => void;
	handleArmyNameChange: (armyId: string) => void;
	handleDuplicateArmyPress: (armyId: string) => void;
	handleToggleFavourite: (armyId: string) => void;
	handleOpenArmyNotes: (armyId: string) => void;
	handleMigrateArmyPress: (armyId: string) => void;
};
const ArmyListCard = ({
	armyList,
	handleArmyListPress,
	handleDeleteArmyPress,
	handleArmyNameChange,
	handleDuplicateArmyPress,
	handleToggleFavourite,
	handleOpenArmyNotes,
	handleMigrateArmyPress,
}: ArmyListCardProps) => {
	const { t } = useTranslation(["builder", "common"]);
	const { theme } = useTheme();
	const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;
	const setImage = () => {
		const armyName = getKeyByValue(Factions, armyList.faction);
		const factionAssets = getLocalFactionAssets(armyName ? armyName : "");
		return (
			<View style={{ position: "absolute", top: 0, borderLeftColor: theme.white, borderLeftWidth: 4 }}>
				<Image style={[styles.stretch]} source={factionAssets && factionAssets[0]} />
			</View>
		);
	};

	return (
		<TouchableOpacity onPress={() => handleArmyListPress(armyList.armyId)}>
			<View
				style={{
					overflow: "hidden",
					backgroundColor: theme.background,
					borderRadius: 8,
					flexDirection: "row",
					borderWidth: 1,
					borderColor: theme.grey3,
				}}
			>
				<Image
					source={require("../../../../assets/images/card-texture.png")}
					resizeMode='contain'
					style={{ opacity: 0.2, position: "absolute" }}
				/>
				<View style={{ flex: 3, margin: 20 }}>
					<View style={{ marginBottom: 4, flex: 1, paddingRight: 30 }}>
						<Text variant='heading3' numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 24 }}>
							{armyList.name}
						</Text>
					</View>

					<View style={{ marginBottom: 4 }}>
						<Text>
							{armyList.faction && getKeyByValue(Factions, armyList.faction).replaceAll("_", " ")}{" "}
						</Text>
					</View>
					<View style={{ alignItems: "center", flexDirection: "row" }}>
						<View>
							<PointsContainer points={armyList.points} />
						</View>
						{armyList.armyNotes !== "" && armyList.armyNotes !== undefined ? (
							<TouchableOpacity
								style={{ marginLeft: 12 }}
								onPress={() => handleOpenArmyNotes(armyList.armyId)}
							>
								<Foundation name='clipboard-notes' size={24} color={theme.white} />
							</TouchableOpacity>
						) : null}

						{/* {armyList.versionNumber !== CURRENT_VERSION && (
							<Pressable
								style={{ marginLeft: 8 }}
								onPress={() => handleMigrateArmyPress(armyList.armyId)}
							>
								<View
									style={{
										backgroundColor: "blue",
										padding: 4,
										paddingHorizontal: 8,
										borderRadius: 4,
									}}
								>
									<Text style={{ marginLeft: 4, numberOfLines: 2 }}>
										Migrate to {CURRENT_VERSION}
									</Text>
								</View>
							</Pressable>
						)} */}
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
					<View
						style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", zIndex: 9999 }}
					>
						{armyList.versionNumber !== CURRENT_VERSION && (
							<Pressable
								style={{ marginLeft: 8 }}
								onPress={() => handleMigrateArmyPress(armyList.armyId)}
							>
								<View
									style={{
										padding: 12,
										paddingHorizontal: 8,
										borderRadius: 8,
										width: 80,
										height: 80,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Image
										style={{
											resizeMode: "cover",
											position: "absolute",
											top: -20,
											left: -20,
											width: 120,
											height: 120,
										}}
										source={require("../../../images/svgs/red_seal.png")}
									/>
									<Text
										style={{
											marginLeft: 4,
											numberOfLines: 2,
											textAlign: "center",
											color: theme.text,
										}}
									>
										Migrate to {CURRENT_VERSION}
									</Text>
								</View>
							</Pressable>
						)}

						<Menu style={{ zIndex: 99 }}>
							<MenuTrigger>
								<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
							</MenuTrigger>
							<MenuOptions
								optionsContainerStyle={{
									borderRadius: 8,
									maxWidth: 170,
									backgroundColor: theme.blueGrey,
								}}
							>
								<MenuOption onSelect={() => handleToggleFavourite(armyList.armyId)}>
									<MenuOptionButton
										icon={<AntDesign name='star' size={18} color={theme.warning} />}
										variant={"outline"}
										ButtonText={
											armyList.isFavourite ? `${t("RemoveFavourite")}` : `${t("SetFavourite")}`
										}
									/>
								</MenuOption>
								{armyList.versionNumber !== CURRENT_VERSION && (
									<MenuOption onSelect={() => handleMigrateArmyPress(armyList.armyId)}>
										<MenuOptionButton
											icon={
												<MaterialCommunityIcons
													name='transfer-right'
													size={18}
													color={theme.text}
												/>
											}
											variant={"outline"}
											ButtonText={`Migrate to ${CURRENT_VERSION}`}
										/>
									</MenuOption>
								)}
								<MenuOption onSelect={() => handleDuplicateArmyPress(armyList.armyId)}>
									<MenuOptionButton
										icon={<FontAwesome name='copy' size={18} color={theme.text} />}
										variant={"outline"}
										ButtonText={t("Duplicate", { ns: "common" })}
									/>
								</MenuOption>
								<MenuOption onSelect={() => handleArmyNameChange(armyList.armyId)}>
									<MenuOptionButton
										icon={<FontAwesome name='pencil' size={18} color={theme.text} />}
										variant={"outline"}
										ButtonText={t("Edit", { ns: "common" })}
									/>
								</MenuOption>
								<MenuOption onSelect={() => handleDeleteArmyPress(armyList.armyId)}>
									<MenuOptionButton
										icon={<AntDesign name='delete' size={18} color={theme.white} />}
										variant={"danger"}
										ButtonText={t("Delete", { ns: "common" })}
									/>
								</MenuOption>
							</MenuOptions>
						</Menu>
					</View>
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
