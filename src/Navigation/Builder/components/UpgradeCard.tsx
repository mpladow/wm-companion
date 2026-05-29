import { Text } from "@components/index";
import PointsContainer from "@components/pointsContainer";
import UpgradeIcon from "@components/UnitCards/UpgradeIcon";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { UpgradeTypes } from "@utils/constants";
import { UpgradesProps } from "@utils/types";
import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

type UpgradeCardProps = {
	upgrade: UpgradesProps;
	targetUnitName: string;
	key: number | string;
	onShowUpgradePreview: () => void;
	onAddUpgradePress: (
		unitName: string,
		type: string,
		points: number,
		upgradeName: string,
		maxCount?: number,
		armyLimitMaxCount?: number,
		addOnUpgrades?: string[],
		replacesUnit?: boolean
	) => void;
	currentCount?: number; // get current count of units in army
};
const UpgradeCard = ({
	upgrade,
	onShowUpgradePreview,
	targetUnitName,
	key,
	onAddUpgradePress,
	currentCount,
}: UpgradeCardProps) => {
	const { theme } = useTheme();
	return (
		<Pressable
			onPress={onShowUpgradePreview}
			key={key}
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: 8,
				backgroundColor: theme.grey3,
				padding: 8,
			}}
		>
			<View style={{ marginRight: 8 }}>
				<UpgradeIcon noCount={currentCount == 0} type={upgrade.type as UpgradeTypes} />
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
										upgrade.armyMax,
										upgrade.addOnUpgrades,
										upgrade.replacesUnit
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
		</Pressable>
	);
};

export default UpgradeCard;

const styles = StyleSheet.create({});
