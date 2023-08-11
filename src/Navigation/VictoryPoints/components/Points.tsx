import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Button, Text, TextBlock } from "@components/index";
import { useVictoryPoints } from "@context/VPContext";
import { useTheme } from "@hooks/useTheme";
import fonts from "@utils/fonts";

type PointsProps = {
	onAddVPPressed: (points: number) => void;
};
const Points = ({ onAddVPPressed }: PointsProps) => {
	const { theme } = useTheme();
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
	const setValManually = (val: string) => {
		const valueParsed = parseInt(val);
		if (!isNaN(valueParsed)) {
			if (valueParsed < 0) setValue(0);
			else {
				setValue(parseInt(val));
			}
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
					{/* <Text style={{fontSize: 28}}>{value}</Text> */}
					<TextInput
						onChangeText={(val) => setValManually(val)}
						style={{ color: theme.text, fontFamily: fonts.PTSansBold, fontSize: 32, textAlign: "center" }}
						keyboardType='numeric'
					>
						{value}
					</TextInput>
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
					<Text bold style={{color: theme.black}}>Add VPs</Text>
				</Button>
			</View>
		</>
	);
};

export default Points;

const styles = StyleSheet.create({});
