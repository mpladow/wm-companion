import { StyleSheet, Text, TextProps, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";


const CustomText = ({ children, ...props }: TextProps) => {
	const { theme } = useTheme();
	return (
		<Text {...props} style={[props.style, { color: theme.text }]}>
			{children}
		</Text>
	);
};

export default CustomText;

