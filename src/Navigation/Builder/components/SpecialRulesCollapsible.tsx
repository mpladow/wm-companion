import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import { Text } from "@components/index";

type SpecialRulesCollapsibleProps = {
	toggleVisible: () => void;
	visible: boolean;
	title: string;
	contents: string[];
};
const SpecialRulesCollapsible = ({ visible, title, contents, toggleVisible }: SpecialRulesCollapsibleProps) => {
	const { theme } = useTheme();
	return (
		<View style={{ padding: 12, margin: 12, borderRadius: 12, backgroundColor: theme.white }}>
			<TouchableOpacity onPress={() => toggleVisible()}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
						<View style={{ marginRight: 4 }}>
							<Feather name='book-open' size={20} color='black' />
						</View>
						<Text bold style={{ color: theme.black }}>
							{title}
						</Text>
					</View>
					<View>
						{!visible ? (
							<AntDesign name='caretup' size={12} color='black' />
						) : (
							<AntDesign name='caretdown' size={12} color='black' />
						)}
					</View>
					{/*Heading of Single Collapsible*/}
				</View>
			</TouchableOpacity>

			<Collapsible collapsed={visible} align='center'>
				<View style={{ paddingVertical: 4, paddingTop: 8 }}>
					{contents && contents?.map((x) => {
						return <Text style={{ color: theme.black }}>{x}</Text>;
					})}
				</View>
			</Collapsible>
		</View>
	);
};

export default SpecialRulesCollapsible;

const styles = StyleSheet.create({});
