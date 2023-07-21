import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";

const Settings = () => {
	const { theme } = useTheme();
	const onPress = () => {
		console.log("onPress");
	};
	const settings = ["About"];
	return (
		<View style={{ display: "flex", flex: 1 }}>
			<View style={{ justifyContent: "space-evenly" }}>
				<View style={{ marginVertical: margin }}>
					<Text style={{ fontWeight: "bold" }}>
						This is a pre-alpha build and will have barebones functionality.
					</Text>
				</View>
				<View style={{ marginVertical: margin }}>
					<TextBlock>
						<Text>A companion app to assist in Warmaster and Warmaster Revolution wargaming.</Text>
					</TextBlock>
					<TextBlock>
						<Text style={{ fontWeight: "bold" }}>Future features:</Text>
					</TextBlock>
					<TextBlock>
						<>
							<Text>- Combat score visual customisations</Text>
							<Text>- Victory Points calculator</Text>
							<Text>- Tournament Progress Management</Text>
						</>
					</TextBlock>
				</View>
				<View style={{ marginVertical: margin }}>
					<Text italic>
						Disclaimer: This is a fan-made hobby project and I have no affiliation with Games Workshop or
						its affiliates.
					</Text>
				</View>
			</View>
		</View>
	);
};

export default Settings;

const styles = StyleSheet.create({});
