import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Text, TextBlock } from "@components/index";
import { useVictoryPoints } from "@context/VPContext";

type PointsProps = {
	onAddVPPressed: (points: number) => void;
};
const Points = ({ onAddVPPressed }: PointsProps) => {
	const [value, setValue] = useState(0);

	const onAddVpPress = () => {
		onAddVPPressed(value);
	};
	const incrementPoint = (toAdd: number = 1) => {
		setValue(value + toAdd);
	};
	const decrementPoint = (toDecrement: number = 1) => {
		if (value > 0 && value - toDecrement >= 0) {
			setValue(value - toDecrement);
		}
	};
	return (
		<>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					height: 220,
				}}
			>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
					<Button onPress={() => decrementPoint(10)} variant={"default"}>
						<Text>-10</Text>
					</Button>
					<Button onPress={decrementPoint} variant={"default"}>
						<Text>-</Text>
					</Button>
				</View>
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<Text>{value}</Text>
				</View>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
					<Button onPress={incrementPoint} variant={"default"}>
						<Text>+</Text>
					</Button>
					<Button onPress={() => incrementPoint(10)} variant={"default"}>
						<Text>+10</Text>
					</Button>
				</View>
			</View>
			<View style={{ flex: 1, margin: 4 }}>
				<Button disabled={value == 0} onPress={() => onAddVpPress()} variant={"confirm"}>
					<Text>Add To VP</Text>
				</Button>
			</View>
		</>
	);
};

export default Points;

const styles = StyleSheet.create({});
