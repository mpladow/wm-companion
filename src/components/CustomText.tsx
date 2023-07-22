import { StyleSheet, Text, TextProps, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import fonts from "@utils/fonts";

export type TextVariant = "bold" | "heading1" | "heading2";
interface CustomTypeProps extends TextProps {
	variant?: TextVariant;
	bold?: boolean;
	italic?: boolean;
}
const CustomText = ({ children, variant, bold, italic, ...props }: CustomTypeProps) => {
	const { theme } = useTheme();

	const setTextFont = () => {
		switch (variant) {
			case "heading1":
				return fonts.PTSansBold;
				break;
			case "heading2":
				return fonts.PTSansBold;
				break;
			case "bold":
				if (bold) return fonts.GaramondBold;
				if (italic) return fonts.GaramondItalic
				else return fonts.GaramondRegular;
			default:
				if (italic) return fonts.GaramondItalic
				return fonts.GaramondRegular;
		}
	};

	return (
		<Text
			{...props}
			style={[
				{
					fontFamily: setTextFont(),
					color: theme.text,
					fontSize: 18,
				},
				props.style,
			]}
		>
			{children}
		</Text>
	);
};

export default CustomText;
