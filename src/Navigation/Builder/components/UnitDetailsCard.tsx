import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { UnitProps } from "@utils/types";
import { Text } from "@components/index";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import PointsContainer from "@components/pointsContainer";
import { SelectedUpgradesProps } from "@context/BuilderContext";
import Spears from "@components/SVGS/Spears";
import Infantry from "@components/UnitCards/Infantry";
import { UnitTypes } from "@utils/constants";
import Cavalry from "@components/UnitCards/Cavalry";
import UnitIcon from "@components/UnitCards/UnitIcon";
import UpgradeIcon from "@components/UnitCards/UpgradeIcon";

type UnitCardDetailsProps = {
	unit: UnitProps;
	existingUnits?: number;
	unitUpgrades: SelectedUpgradesProps[];
	key: string;
	onShowUnitDetails: (unitName: string, points: number | undefined, isLeader: boolean) => void;
	onDeleteUnit: (unitId: string) => void;
	onAddUpgrade: (unitId: string) => void;
	onRemoveUpgrade: (unitName: string, id: string) => void;
	onUnitCardPress: (unitName: string) => void;
	onUpgradePress: (upgradeName: string) => void;
};
const UnitDetailsCard = ({
	unit,
	unitUpgrades,
	existingUnits = 0,
	key,
	onShowUnitDetails,
	onDeleteUnit,
	onAddUpgrade,
	onRemoveUpgrade,
	onUnitCardPress,
	onUpgradePress,
}: UnitCardDetailsProps) => {
	const { theme } = useTheme();

	return (
		<View key={key} style={{ flexDirection: "column", padding: 12, backgroundColor: theme.blueGrey }}>
			<>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
						<View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
							<View style={{ marginRight: 8 }}>
								<UnitIcon type={unit.type} canShoot={unit.range == undefined ? false : true} />
							</View>
							<Text bold style={{ fontSize: 16 }}>
								{`${existingUnits} x ${unit.name}`}
							</Text>
							<View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 12 }}>
								<PointsContainer points={unit.points} />
							</View>
						</View>
					</TouchableOpacity>
					<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
						<Menu>
							<MenuTrigger>
								<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
							</MenuTrigger>
							<MenuOptions optionsContainerStyle={{ borderRadius: 8, maxWidth: 120, padding: 4 }}>
								<MenuOption onSelect={() => onDeleteUnit(key)}>
									<View style={{ flexDirection: "row", padding: 4 }}>
										<AntDesign name='delete' size={18} color={theme.black} />
										<View style={{ marginLeft: 8 }}>
											<Text style={{ color: theme.black }}>Delete</Text>
										</View>
									</View>
								</MenuOption>
								{!unit.noMagic ? (
									<MenuOption onSelect={() => onAddUpgrade(key)}>
										<View style={{ flexDirection: "row", marginTop: 12, padding: 4 }}>
											<AntDesign name='plus' size={18} color='black' />
											<View style={{ marginLeft: 8 }}>
												<Text style={{ color: theme.black }}>Add Item</Text>
											</View>
										</View>
									</MenuOption>
								) : null}
							</MenuOptions>
						</Menu>
					</View>
				</View>
				{/* // Display unit stats here
			<View style={{flex: 1, flexDirection: 'row'}}>
			<View style={{backgroundColor: theme.black, padding: 4, paddingHorizontal: 8, borderRadius: 16, justifyContent: 'flex-start'}}>
			
			<Text>dfsdfds</Text>
			</View>
		</View> */}
				{unitUpgrades?.map((item) => {
					return (
						<View key={item.id} style={{ flex: 1, flexDirection: "row", padding: 4, marginTop: 4 }}>
							<View
								style={{
									backgroundColor: theme.black,
									padding: 8,
									paddingHorizontal: 12,
									borderRadius: 16,
									justifyContent: "flex-start",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<TouchableOpacity
									style={{ flexDirection: "row", alignItems: "center" }}
									onPress={() => onUpgradePress(item.upgradeName)}
								>
									<View style={{ marginRight: 8 }}>
										<UpgradeIcon type={item.type} />
									</View>
									<Text>{item.currentCount} x </Text>
									<Text bold>{item.upgradeName}</Text>
									<View style={{ marginLeft: 8 }}>
										<Text>{item.points} points</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => onRemoveUpgrade(item.attachedToName, item.id)}>
									<View
										style={{
											backgroundColor: theme.danger,
											alignItems: "center",
											justifyContent: "center",
											padding: 8,
											borderRadius: 8,
											marginLeft: 12,
										}}
									>
										<AntDesign name='delete' size={12} color={theme.black} />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					);
				})}
			</>
		</View>
	);
};

export default UnitDetailsCard;

const styles = StyleSheet.create({});
