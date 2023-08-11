import { StyleProp, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@hooks/useTheme";

type variant = "default" | "primary" | "secondary" | "confirm" | "warning" | "danger" | "text";
export type size = "sm" | "lg";
type buttonProps = {
	onPress: () => void;
	style?: any;
	variant: variant;
	children: ReactNode;
	disabled?: boolean;
	circle?: boolean;
	size?: size;
};
const Button = ({ children, onPress, variant, circle, disabled, size, style }: buttonProps) => {
	const [pressing, setPressing] = useState(false);
	const { theme } = useTheme();
	useEffect(() => {
		// setPressing(pressing);
		if (pressing) onPress();
	}, [pressing]);
	const setVariant = () => {
		switch (variant) {
			case "confirm":
				return { backgroundColor: theme.warning };
			case "danger":
				return { backgroundColor: "red" };
			case "warning":
				return { backgroundColor: theme.warning };
			case "secondary":
				return { backgroundColor: theme.secondary };
				case "text":
					return {backgroundColor: 'transparent', border: 0}
			default:
				return { backgroundColor: theme.secondary };
		}
	};
	return (
		<TouchableOpacity
			disabled={disabled}
			onPressIn={() => setPressing(true)}
			onPressOut={() => setPressing(false)}
			// hitSlop={10}
			activeOpacity={0.8}
			style={[
				styles.button,
				circle && styles.buttonRound,
				{ alignItems: "center", elevation: pressing ? 0 : 8 },
				setVariant(),
				disabled && styles.disabled,
				size == "lg" && styles.large,
				style
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
		padding: 16,
		backgroundColor: "grey",
		borderRadius: 28,
		boxShadow: `0px 0px 18px 8px rgba(0, 0, 0, 0.80)`,
		alignItems: "center",
		justifyContent: "center",
	},
	large: {
		paddingHorizontal: 48,
		paddingVertical: 16,
	},
	buttonRound: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 200,
		width: 70,
		height: 70,
		maxWidth: 100,
		maxHeight: 100,
	},
	disabled: {
		opacity: 0.5,
	},
});
