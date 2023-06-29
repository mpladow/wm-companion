import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Button from "@Components/button";
import { Styling } from "@Utils/index";

type SectionDialsProps = {
	onLeftButtonPress: () => void;
	onRightButtonPress: () => void;
	value: number | string;
	direction: "row" | "column";
	textSize: number;
};
const SectionDials = ({ onLeftButtonPress, onRightButtonPress, textSize, value, direction }: SectionDialsProps) => {

	return (
		<View style={{ flex: 1, flexDirection: direction, alignItems: "center" }}>
			<View style={{ flex: 1, padding: 8, alignItems: "center" }}>
				<Button onPress={onLeftButtonPress} variant={"default"} children={<Text>-</Text>} />
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: textSize}}>{value}</Text>
			</View>
			<View style={{ flex: 1, padding: 8, alignItems: "center" }}>
				<Button onPress={onRightButtonPress} variant={"default"} children={<Text>+</Text>} />
			</View>
		</View>
	);
};

export default SectionDials;

const styles = StyleSheet.create({});
