import { StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { margin } from "@utils/constants";
import Constants from "expo-constants";
import Logo from "@components/SVGS/Logo";
import LogoWmr from "@components/SVGS/LogoWmr";
import fontSize from "@utils/styling";

const Home = () => {
	const { theme } = useTheme();
	const version = Constants?.manifest?.version;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<View style={{ flex: 1, padding: 16 }}>
				<View style={{ justifyContent: "space-evenly" }}>
					<View style={{ marginVertical: margin }}>
						<TextBlock>
							<>
								<View style={{ alignSelf: 'center', justifyContent: "center", alignItems: "center", flexDirection: 'column' }}>
									<LogoWmr height={80} width={200} />
                                    <View style={{marginTop: -12}}>
                                    <Text variant="heading3" style={{fontSize: 24}}>Companion</Text>

                                    </View>
								</View>
								<Text bold>{version}</Text>
								<Text bold style={{textAlign: 'center'}}>
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
		</SafeAreaView>
	);
};

export default Home;

const styles = StyleSheet.create({});
