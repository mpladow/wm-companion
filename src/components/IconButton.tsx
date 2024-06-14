import { Pressable, StyleSheet, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type variant =
	| "default"
	| "primary"
	| "secondary"
	| "confirm"
	| "warning"
	| "danger"
	| "text"
	| "outline-dark"
	| "outline-light"
	| "navigation-button";
export type size = "sm" | "lg";
type buttonProps = {
	onPress: () => void;
	style?: any;
	variant: variant;
	children?: ReactNode;
	disabled?: boolean;
	circle?: boolean;
	size?: size;
	title: string;
	icon: JSX.Element;
	isStackNavigation?: boolean;
	isNewWindow?: boolean;
};
const IconButton = ({
	onPress,
	circle,
	disabled,
	size,
	style,
	title,
	isStackNavigation,
	isNewWindow,
	icon,
}: buttonProps) => {
	const [pressing, setPressing] = useState(false);
	const { theme } = useTheme();
	useEffect(() => {
		// setPressing(pressing);
		if (pressing) onPress();
	}, [pressing]);
	return (
		<Pressable
			disabled={disabled}
			onPress={() => onPress()}
			// onPressOut={() => setPressing(false)}
			// hitSlop={10}
			style={[
				styles.button,
				circle && styles.buttonRound,
				{ alignItems: "center", elevation: pressing ? 0 : 8 },
				{ backgroundColor: theme.white },
				disabled && styles.disabled,
				size == "lg" && styles.large,
				style,
			]}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={{ flex: 1 }}>{icon}</View>
				<View style={{ flex: 10 }}>
					<Text style={{ color: theme.black }}>{title}</Text>
				</View>
				<View style={{ flex: 1 }}>
					{isNewWindow && <MaterialCommunityIcons name='open-in-new' size={24} color='black' />}
					{isStackNavigation && <AntDesign name='right' size={20} color='black' />}
				</View>
			</View>
		</Pressable>
	);
};

export default IconButton;

const styles = StyleSheet.create({
	button: {
		elevation: 4,
		padding: 16,
		backgroundColor: "grey",
		borderRadius: 28,
		// boxShadow: `0px 0px 18px 8px rgba(0, 0, 0, 0.80)`,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 999,
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
