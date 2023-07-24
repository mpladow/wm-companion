import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { ModalContainer, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const onPress = () => {
		console.log("onPress");
	};
	const settings = ["About"];
	return (
		<ModalContainer onPageModalClosePressed={() => navigation.goBack()} headerTitle={"Settings"} >
			<View style={{ display: "flex", flex: 1, backgroundColor: theme.black, padding: 8 }}>
				<View style={{ justifyContent: "space-evenly" }}>
					<View style={{ marginVertical: margin }}>
						<Text bold>This is a pre-alpha build and will have barebones functionality.</Text>
					</View>
					<View style={{ marginVertical: margin }}>
						<TextBlock>
							<Text>A companion app to assist in Warmaster and Warmaster Revolution wargaming.</Text>
						</TextBlock>
						<TextBlock>
							<Text bold>Future features:</Text>
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
						<Text bold>
							Disclaimer: This is a fan-made hobby project and I have no affiliation with Games Workshop
							or its affiliates.
						</Text>
					</View>
				</View>
			</View>
		</ModalContainer>
	);
};

export default Settings;

const styles = StyleSheet.create({});
