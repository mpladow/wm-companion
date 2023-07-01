import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { ReactNode } from "react";

type variant = "default" | "primary" | "secondary" | "confirm" | "danger";
type buttonProps = {
	onPress: () => void;
	variant: variant;
	children: ReactNode;
};
const Button = ({ children, onPress, variant }: buttonProps) => {
	return (
		<TouchableOpacity
			hitSlop={20}
			activeOpacity={0.8}
			onPress={onPress}
			style={[styles.button, { alignItems: "center" }]}
		>
			{children}
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: { padding: 12, backgroundColor: "grey", borderRadius: 8 },
});
