import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { Text } from "@components/index";
import { margin } from "@utils/constants";

const Settings = () => {
	const { theme } = useTheme();
	const onPress = () => {
		console.log("onPress");
	};
	const settings = ["About"];
	return (
		<View style={{ display: "flex", flex: 1 }}>
			<View>
				<Text style={{ fontSize: Styling.xl, fontWeight: "bold" }}>WMR Combat Calculator</Text>
				<View style={{marginVertical: margin}}>
				<Text style={{fontWeight: "bold"}}>This is a pre-alpha build and will have barebones functionality.</Text>
				</View>
				<View style={{ marginVertical: margin }}>
					<Text>A companion app to assist in Warmaster and Warmaster Revolution wargaming.</Text>
					<Text style={{fontWeight:'bold'}}>Future features:</Text>
					<Text>- Combat score visual customisations</Text>
					<Text>- Victory Points calculator</Text>
					<Text>- Tournament Progress Management</Text>
				</View>
				<View style={{ marginVertical: margin }}>
					<Text>
						Disclaimer: This is a fan-made hobby project and I have no affiliation with Games Workshop or its
						affiliates.
					</Text>
				</View>
			</View>
			{/* <FlatList
				contentContainerStyle={{ flex: 1, justifyContent: "center" }}
				data={settings}
				renderItem={({ item, index }) => (
					<View style={{ marginTop: Styling.md }}>
						<Pressable key={index} onPress={onPress}>
							<View
								style={{
									padding: 4,
									borderWidth: 1,
									borderColor: theme.backgroundVariant,
									borderRadius: 4,
									alignItems: "center",
									flexDirection: "row",
									height: 50,
								}}
							>
								<Text>{item}</Text>
							</View>
						</Pressable>
					</View>
				)}
			/> */}
		</View>
	);
};

export default Settings;

const styles = StyleSheet.create({});
