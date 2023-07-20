import { StyleSheet, Text, View } from "react-native";
import React, { ReactElement } from "react";

type TextBlockProps = {
	children: ReactElement;
	variant?: "small" | "medium" | "large";
	centered?: boolean;
};
const TextBlock = ({ children, variant, centered }: TextBlockProps) => {
	const spacing = () => {
		switch (variant) {
			case "small":
				return 4;
				break;
			case "medium":
				return 8;
			case "large":
				return 12;
			default:
				return 0;
				break;
		}
	};
	return (
		<View style={{ alignItems: centered ? "center" : "flex-start", paddingBottom: 4,marginBottom: spacing() }}>
			{children}
		</View>
	);
};

export default TextBlock;

const styles = StyleSheet.create({});
