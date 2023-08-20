import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { ModalContainer, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const Settings = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const onPress = () => {
		navigation.goBack();

	};
	const version = Constants?.manifest?.version

	return (
		<ModalContainer
			rotateContainer={false}
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={"Information"}
		>
			<View style={{ display: "flex", flex: 1, backgroundColor: theme.black, padding: 8 }}>
				<View style={{ justifyContent: "space-evenly" }}>
					<View style={{ marginVertical: margin }}>
						<TextBlock>
							<>
								<Text bold>{version}</Text>
								<Text bold>
									This is an alpha build with additional functionality being added over time.
								</Text>
							</>
						</TextBlock>
						<TextBlock>
							<>
								<Text>If any bugs are found, please report them to: </Text>
								<Text>ml.development.2022@gmail.com</Text>
							</>
						</TextBlock>
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
								<Text>- Additional Faction support</Text>
								<Text>- UI Improvements</Text>
								<Text>- Tournament Progress Management</Text>
								<Text>- Ability to save game results</Text>
								<Text>- Army List creator</Text>
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
