import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@hooks/useTheme";

type variant = "default" | "primary" | "secondary" | "confirm" | "warning" | "danger";
type buttonProps = {
	onPress: () => void;
	variant: variant;
	children: ReactNode;
	disabled?: boolean;
	circle?: boolean;
};
const Button = ({ children, onPress, variant, circle, disabled }: buttonProps) => {
	const [pressing, setPressing] = useState(false);
	const { theme } = useTheme();
	useEffect(() => {
		// setPressing(pressing);
		if (pressing) onPress();
	}, [pressing]);
	const setVariant = () => {
		switch (variant) {
			case "confirm":
				return { backgroundColor: theme.success };
			case "danger":
				return { backgroundColor: "red" };
			case "warning":
				return { backgroundColor: theme.warning };

			default:
				return { backgroundColor: theme.secondary };
		}
	};
	return (
		<TouchableOpacity
			disabled={disabled}
			onPressIn={() => setPressing(true)}
			onPressOut={() => setPressing(false)}
			hitSlop={20}
			activeOpacity={0.8}
			style={[
				styles.button,
				circle && styles.buttonRound,
				{ alignItems: "center", elevation: pressing ? 0 : 8 },
				setVariant(),
				disabled && styles.disabled,
			]}
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
		alignItems: "center",
		justifyContent: "center",
	},
	buttonRound: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 200,
		width: 80,
		height: 80,
		maxWidth: 100,
		maxHeight: 100,
	},
	disabled: {
		opacity: 0.5,
	},
});
