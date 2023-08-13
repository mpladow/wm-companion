import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { UnitProps } from "@utils/types";
import { Text } from "@components/index";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import PointsContainer from "@components/pointsContainer";
import { SelectedUpgradesProps } from "@context/BuilderContext";
import UnitIcon from "@components/UnitCards/UnitIcon";
import UpgradeIcon from "@components/UnitCards/UpgradeIcon";
import MenuOptionButton from "@components/MenuOptionButton";
import MagicOrb from "@components/SVGS/MagicOrb";
import { get1000PointInterval } from "../utils/builderHelpers";
import { current } from "@reduxjs/toolkit";
import UnitDetailsMenu from "./UnitDetailsMenu";
import AnimatedView from "@components/Animated/AnimatedView";

type UnitCardDetailsProps = {
	unit: UnitProps;
	existingUnits?: number;
	unitUpgrades: SelectedUpgradesProps[];
	key: string;
	onShowUnitDetails: (unitName: string, points: number | undefined, isLeader: boolean) => void;
	onDeleteUnit: (unitId: string) => void;
	onAddUnit: (
		unitName: string,
		points: number | undefined,
		isLeader: boolean,
		maxCount?: number,
		minCount?: number,
		ignoreBreakPoint?: boolean
	) => void;
	onAddUpgrade: (unitId: string) => void;
	onRemoveUpgrade: (unitName: string, id: string) => void;
	onUnitCardPress: (unitName: string) => void;
	onUpgradePress: (upgradeName: string) => void;
	currentArmyCount: number;
	hasError: boolean;
};
const UnitDetailsCard = ({
	unit,
	unitUpgrades,
	existingUnits = 0,
	key,
	onShowUnitDetails,
	onAddUnit,
	onDeleteUnit,
	onAddUpgrade,
	onRemoveUpgrade,
	onUnitCardPress,
	onUpgradePress,
	currentArmyCount,
	hasError,
}: UnitCardDetailsProps) => {
	const { theme } = useTheme();

	const getUnitArmyMax = () => {
		const interval = get1000PointInterval(currentArmyCount);
		let currentMax: string | undefined = "";
		if (unit.armyMax) {
			currentMax = unit.armyMax.toString();
		}
		if (unit.max) {
			currentMax = (unit.max * interval).toString();
		} else {
			currentMax = "-";
		}
		return currentMax;
	};
	const [triggerScale, setTriggerScale] = useState(false);
	useEffect(() => {
		console.log("triggerScale...");
		if (triggerScale) {
			console.log("SET TRIGGER SCALE TO FALSE");
			setTriggerScale(false);
		}
	}, [triggerScale]);

	useEffect(() => {
		setTriggerScale(true);
	}, [existingUnits]);
	return (
		<View key={key} style={{ flexDirection: "column", padding: 12, backgroundColor: theme.background }}>
			<>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<TouchableOpacity onPress={() => onUnitCardPress(unit.name)}>
						<View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
							<View style={{ marginRight: 8 }}>
								<UnitIcon type={unit.type} canShoot={unit.range == undefined ? false : true} />
							</View>
							<AnimatedView animate={triggerScale}>
								<Text bold variant='heading3' style={{ fontSize: 18 }}>
									{hasError && <Text style={{ color: theme.warning, fontSize: 18 }}>* </Text>}
									{`${existingUnits} x ${unit.name}`}
								</Text>
							</AnimatedView>
							<View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 12 }}>
								<PointsContainer points={unit.points} />
							</View>
						</View>
					</TouchableOpacity>

					<View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
						<View style={{ flex: 1, marginRight: 12, justifyContent: "flex-end", alignItems: "flex-end" }}>
							<Text>
								{unit.armyMin ? unit.armyMax : unit.min} / <Text bold>{getUnitArmyMax()}</Text>
							</Text>
						</View>
						<UnitDetailsMenu
							noMagic={!unit.noMagic}
							onAddUnit={() =>
								onAddUnit(
									unit.name,
									unit.points,
									unit.command ? true : false,
									unit.armyMax ? unit.armyMax : unit.max,
									unit.armyMin ? unit.armyMin : unit.min,
									unit.noCount
								)
							}
							onAddUpgrade={() => onAddUpgrade(key)}
							onDeleteUnit={() => onDeleteUnit(key)}
						/>
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

									<View style={{ marginLeft: 8, justifyContent: "flex-start" }}>
										<PointsContainer points={item.points} />
									</View>
									{/* <View style={{ marginLeft: 8, flexDirection: "row", alignItems: "center" }}>
										<Text bold style={{ fontSize: 12 }}>
											{item.points}
										</Text>
										<Text> points</Text>
									</View> */}
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
