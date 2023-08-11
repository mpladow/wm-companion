import { StyleSheet, TouchableOpacity, View } from "react-native";
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

type ArmyListCardProps = {
	armyList: ArmyListProps;
	handleArmyListPress: (armyId: string) => void;
	handleDeleteArmyPress: (armyId: string) => void;
	handleArmyNameChange: (armyId: string) => void;
};
const ArmyListCard = ({
	armyList,
	handleArmyListPress,
	handleDeleteArmyPress,
	handleArmyNameChange,
}: ArmyListCardProps) => {
	const menuRef = useRef(null);
	const { theme } = useTheme();

	return (
		<TouchableOpacity onPress={() => handleArmyListPress(armyList.armyId)}>
			<View style={{ backgroundColor: theme.grey3, padding: 20, borderRadius: 8, flexDirection: "row" }}>
				<View style={{ flex: 3 }}>
					<View style={{ marginBottom: 4 }}>
						<Text variant='heading1' style={{ fontSize: 20 }}>
							{armyList.name}
						</Text>
					</View>

					<View style={{ marginBottom: 4 }}>
						<Text>{Object.keys(Factions)[armyList.faction - 1]?.replace("_", " ")}</Text>
					</View>
					<View style={{ alignItems: "flex-start" }}>
						<PointsContainer points={armyList.points} />
					</View>
				</View>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
					<Menu>
						<MenuTrigger>
							<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
						</MenuTrigger>
						<MenuOptions optionsContainerStyle={{ borderRadius: 8, maxWidth: 120, padding: 4 }}>
							<MenuOption onSelect={() => handleDeleteArmyPress(armyList.armyId)}>
								<View style={{ flexDirection: "row", padding: 4 }}>
									<AntDesign name='delete' size={18} color={theme.black} />
									<View style={{ marginLeft: 8 }}>
										<Text style={{ color: theme.black }}>Delete</Text>
									</View>
								</View>
							</MenuOption>
							<MenuOption onSelect={() => handleArmyNameChange(armyList.armyId)}>
								<View style={{ flexDirection: "row", padding: 8 }}>
									<FontAwesome name='pencil' size={18} color='black' />
									<View style={{ marginLeft: 8 }}>
										<Text style={{ color: theme.black }}>Edit Name</Text>
									</View>
								</View>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ArmyListCard;

const styles = StyleSheet.create({});
