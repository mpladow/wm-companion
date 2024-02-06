import { StyleSheet, Text, TextProps, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import fonts from "@utils/fonts";

export type TextVariant = "bold" | "heading1" | "heading2" | "heading3";
type CustomTypeProps = {
	variant?: TextVariant;
	bold?: boolean;
	italic?: boolean;
	style?: TextProps
} & TextProps
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
			case "heading3":
				return fonts.BarlowCodensedBold;
			case "bold":
				if (bold) return fonts.PTSansBold;
				if (italic) return fonts.PTSansItalic;
				else return fonts.PTSansRegular;
			default:
				if (italic) return fonts.PTSansItalic;
				if (bold) return fonts.PTSansBold;
				return fonts.PTSansRegular;
		}
	};

	return (
		<Text
			{...props}
			style={[
				{
					fontFamily: setTextFont(),
					color: theme.text,
					fontSize: 14,
				},
				props.style,
			]}
		>
			{children}
		</Text>
	);
};

export default CustomText;
