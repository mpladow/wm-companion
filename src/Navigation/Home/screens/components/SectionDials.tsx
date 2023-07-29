import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import React from "react";
import Button from "@components/button";
import { Styling } from "@utils/index";
import { margin } from "@utils/constants";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";

type SectionDialsProps = {
	onLeftButtonPress: () => void;
	onRightButtonPress: () => void;
	value: number | string;
	direction: "row" | "column";
	textSize: number;
};
const SectionDials = ({ onLeftButtonPress, onRightButtonPress, textSize, value, direction }: SectionDialsProps) => {
	const { theme } = useTheme();
	return (
		<View style={{ flex: 1, flexDirection: direction, alignItems: "center" }}>
			<View style={{ flex: 1, alignItems: 'center', marginHorizontal: margin * 8 }}>
				<Button
				circle
					onPress={onLeftButtonPress}
					variant={"default"}
					children={<Text style={{ fontSize: Styling.xl, color: theme.text }}>-</Text>}
				/>
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: textSize, color: theme.text }}>{value}</Text>
			</View>
			<View style={{ flex: 1, alignItems: 'center',marginHorizontal: margin * 8 }}>
				<Button
				circle
					onPress={onRightButtonPress}
					variant={"default"}
					children={<Text style={{ fontSize: Styling.xl, color: theme.text }}>+</Text>}
				/>
			</View>
		</View>
	);
};

export default SectionDials;

const styles = StyleSheet.create({});
