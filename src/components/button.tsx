import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";

type variant = "default" | "primary" | "secondary" | "confirm" | "danger";
type buttonProps = {
	onPress: () => void;
	variant: variant;
	children: ReactNode;
	circle?: boolean;
};
const Button = ({ children, onPress, variant, circle }: buttonProps) => {
	const [pressing, setPressing] = useState(false);

	useEffect(() => {
		// setPressing(pressing);
		if (pressing) onPress();
	}, [pressing]);
	return (
		<TouchableOpacity
			onPressIn={() => setPressing(true)}
			onPressOut={() => setPressing(false)}
			hitSlop={20}
			activeOpacity={0.8}
			style={[styles.button, circle && styles.buttonRound, { alignItems: "center", elevation: pressing ? 0 : 8 }]}
		>
			{children}
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		elevation: 4,
		padding: 12,
		backgroundColor: "grey",
		borderRadius: 4,
		boxShadow: `0px 0px 18px 8px rgba(0, 0, 0, 0.80)`,
		alignItems: 'center', justifyContent: 'center'
	},
	buttonRound: {
		alignItems: 'center', justifyContent: 'center',
		borderRadius: 200,
		width: 80,
		height: 80,
		maxWidth: 100,
		maxHeight: 100,
	},
});
