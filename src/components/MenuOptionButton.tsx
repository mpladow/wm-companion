import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";

type MenuOptionButton = {
	icon: JSX.Element;
	variant: "disabled" | "confirm" | "danger" | "outline";
	ButtonText: string;
};
type VariantStyle = {
	backgroundColor: string;
	textColor: string;
};
const MenuOptionButton = ({ icon, variant, ButtonText }: MenuOptionButton) => {
	const renderVariantStyle = () => {
		switch (variant) {
			case "confirm":
				return { backgroundColor: theme.accent, textColor: theme.black } as VariantStyle;
			case "disabled":
				return { backgroundColor: theme.grey, textColor: theme.white } as VariantStyle;
			case "danger":
				return { backgroundColor: theme.danger, textColor: theme.white } as VariantStyle;
			case "outline":
				return {
					backgroundColor: "transparent",
					textColor: theme.text,
					borderColor: theme.blueGrey,
					borderWidth: 2,
				};
			default:
				return { backgroundColor: theme.accent, textColor: theme.black } as VariantStyle;
		}
	};
	const { theme } = useTheme();
	return (
		<View
			style={{
				borderRadius: 8,
				backgroundColor: renderVariantStyle().backgroundColor,
				flexDirection: "row",
				padding: 8,
				paddingHorizontal: 4,
                alignItems: 'center'
			}}
		>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			{icon}
			</View>
			<View style={{ flex: 4, marginLeft: 8 }}>
				<Text style={{ color: renderVariantStyle().textColor }}>{ButtonText}</Text>
			</View>
		</View>
	);
};

export default MenuOptionButton;

const styles = StyleSheet.create({});
