import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "@components/index";
import Checkbox from "expo-checkbox";
import { useTheme } from "@hooks/useTheme";

type CustomCheckboxProps = {
	onValueChange: (value: boolean) => void;
	disabled?: boolean;
	value: boolean;
	label?: string;
};
const CustomCheckbox = ({ onValueChange, disabled, value, label }: CustomCheckboxProps) => {
	const { theme } = useTheme();
	return (
		<View style={{ alignItems: "center", flexDirection: "row" }}>
			{label ? (
				<TouchableOpacity onPress={() => onValueChange(!value)}>
					<Text bold style={{ marginRight: 8 }}>
						{label}
					</Text>
				</TouchableOpacity>
			) : null}
			<Checkbox
				color={theme.accent}
				disabled={disabled}
				value={value}
				onValueChange={(newValue) => onValueChange(newValue)}
			/>
		</View>
	);
};

export default CustomCheckbox;

const styles = StyleSheet.create({});
