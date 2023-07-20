import { StyleSheet, Text, TextProps, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import fontSize from "@utils/styling";

export type TextVariant = "bold" | "heading1" | "heading2";
interface CustomTypeProps extends TextProps {
	variant?: TextVariant;
	bold?: boolean;
	italic?: boolean;
}
const CustomText = ({ children, variant, bold, italic, ...props }: CustomTypeProps) => {
	const { theme } = useTheme();

	return (
		<Text
			{...props}
			style={[
				{ color: theme.text, fontWeight: bold ? "500" : "normal", fontStyle: italic ? "italic" : "normal" },
				props.style,
			]}
		>
			{children}
		</Text>
	);
};

export default CustomText;
