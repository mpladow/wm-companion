import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { UnitProps, UpgradesProps } from "@utils/types";
import { Button, Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import PointsContainer from "@components/pointsContainer";
import { Entypo } from "@expo/vector-icons";
import UpgradeIcon from "@components/UnitCards/UpgradeIcon";
import { UpgradeTypes } from "@utils/constants";

type UpgradeCardProps = {
	upgrade: UpgradesProps;
	targetUnitName: string;
	key: number | string;
	onAddUpgradePress: (
		unitName: string,
		type: string,
		points: number,
		upgradeName: string,
		maxCount?: number,
		armyLimitMaxCount?: number
	) => void;
	currentCount?: number; // get current count of units in army
};
const UpgradeCard = ({ upgrade, targetUnitName, key, onAddUpgradePress, currentCount }: UpgradeCardProps) => {
	const { theme } = useTheme();
	return (
		<View
			key={key}
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: 8,
				backgroundColor: theme.blueGrey,
				padding: 8,
			}}
		>
			<View style={{ marginRight: 8 }}>
				<UpgradeIcon type={upgrade.type as UpgradeTypes} />
			</View>
			<View style={{ flex: 2 }}>
				<Text bold>{upgrade.name}</Text>

				<View>
					<Text>{currentCount} x units in force</Text>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<View
					style={{
						flex: 1,
						marginBottom: 4,
						alignItems: "center",
						justifyContent: "flex-end",
						flexDirection: "row",
					}}
				>
					<View style={{ padding: 8, flexDirection: "row" }}>
						<Text>{upgrade.max ? `Max: ${upgrade.max}` : `Max: ${upgrade.armyMax}`}</Text>
					</View>
					<View>
						<View style={{ justifyContent: "center", alignItems: "center", marginBottom: 4 }}>
							<TouchableOpacity
								onPress={() =>
									onAddUpgradePress(
										targetUnitName,
										upgrade.type,
										upgrade.points as number,
										upgrade.name,
										upgrade.max,
										upgrade.armyMax
									)
								}
							>
								<View style={{ backgroundColor: theme.warning, borderRadius: 4, padding: 4 }}>
									<Entypo name='plus' size={24} color='black' />
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ alignItems: "flex-start" }}>
							<PointsContainer points={upgrade.points as number} />
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default UpgradeCard;

const styles = StyleSheet.create({});
