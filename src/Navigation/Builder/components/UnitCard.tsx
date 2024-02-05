import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { UnitProps } from "@utils/types";
import { Button, Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import PointsContainer from "@components/pointsContainer";
import { Entypo } from "@expo/vector-icons";
import UnitIcon from "@components/UnitCards/UnitIcon";
import { get1000PointInterval } from "../utils/builderHelpers";

type UnitCardProps = {
	unit: UnitProps;
	key: number | string;
	onAddUnitPress: (
		unitName: string,
		points: number | undefined,
		isLeader: boolean,
		maxCount?: number,
		minCount?: number,
		ignoreBreakPoint?: boolean
	) => void;
	currentCount?: number; // get current count of units in army
	onUnitCardPress?: (unitName: string) => void;
	currentArmyCount: number;
};
const UnitCard = ({ unit, key, onAddUnitPress, currentCount, currentArmyCount }: UnitCardProps) => {
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
				<UnitIcon noCount={currentCount == 0} type={unit.type} canShoot={unit.range == undefined ? false : true} />
			</View>
			<View style={{ flex: 2 }}>
				<Text bold style={{fontSize: 16}}>{unit.name}</Text>

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
						<Text>
							{unit.armyMin ? unit.armyMax : unit.min} / {getUnitArmyMax()}
						</Text>
					</View>
					<View>
						<View style={{ justifyContent: "center", alignItems: "center", marginBottom: 4 }}>
							<TouchableOpacity
								onPress={() =>
									onAddUnitPress(
										unit.name,
										unit.points,
										unit.command ? true : false,
										unit.armyMax ? unit.armyMax : unit.max,
										unit.armyMin ? unit.armyMin : unit.min,
										unit.noCount
									)
								}
							>
								<View style={{ backgroundColor: theme.warning, borderRadius: 4, padding: 4 }}>
									<Entypo name='plus' size={24} color='black' />
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ alignItems: "flex-start" }}>
							<PointsContainer points={unit.points} />
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default UnitCard;

const styles = StyleSheet.create({});
