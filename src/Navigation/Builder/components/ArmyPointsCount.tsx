import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Text } from "@components/index";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

type ArmyPointsCount = {
	armyErrorsCount: number;
	setVisibility: (visibility: boolean) => void;
	armyCount: string;
	disableButton?: boolean;
};
const ArmyPointsCount = ({ armyErrorsCount, setVisibility, armyCount, disableButton }: ArmyPointsCount) => {
	const { theme } = useTheme();
	return (
		<View
			style={{
				flexDirection: "row",
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.5,
				shadowRadius: 3.84,
				elevation: 5,
			}}
		>
			{/* TODO extract out  */}
			<TouchableOpacity
				disabled={disableButton}
				onPress={() => armyErrorsCount > 0 && !disableButton && setVisibility(true)}
			>
				<View style={{ width: 40, height: 40 }}>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: armyErrorsCount > 0 ? theme.warning : "green",
						}}
					>
						<View>
							{armyErrorsCount > 0 ? (
								<Entypo name='warning' size={20} color='black' />
							) : (
								<AntDesign name='check' size={24} color='black' />
							)}
						</View>
						<View>
							{armyErrorsCount > 0 ? (
								<Text style={{ fontSize: 20, color: theme.black }}>{armyErrorsCount}</Text>
							) : null}
						</View>
					</View>
				</View>
			</TouchableOpacity>
			<View
				style={{
					paddingHorizontal: 10,
					backgroundColor: theme.white,
					alignItems: "center",
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.27,
					shadowRadius: 4.65,

					elevation: 6,
				}}
			>
				<Text bold style={{ color: theme.black }}>
					{armyCount}
				</Text>
				<Text bold style={{ color: theme.black }}>
					POINTS
				</Text>
			</View>
		</View>
	);
};

export default ArmyPointsCount;

const styles = StyleSheet.create({});
