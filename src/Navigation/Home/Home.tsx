import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { margin } from "@utils/constants";
import Constants from "expo-constants";
import Logo from "@components/SVGS/Logo";
import LogoWmr from "@components/SVGS/LogoWmr";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
	const { theme } = useTheme();
	const version = Constants?.manifest?.version;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<ImageBackground
				source={require("../../../assets/images/wmr_bg.png")}
				resizeMode='cover'
				style={[styles.image]}
			>
				<LinearGradient
					colors={["rgba(31,46,39, 0.4)", "rgba(6,9,7, 0.9)"]}
					start={{ y: 0, x: 0.5 }}
					end={{ y: 0.5, x: 0 }}
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: -0,
						height: Dimensions.get("screen").height,
						zIndex: 9,
					}}
				></LinearGradient>
				<View style={{ zIndex: 9, flex: 1, padding: 16 }}>
					<View style={{ justifyContent: "space-evenly" }}>
						<View style={{ marginVertical: margin }}>
							<TextBlock>
								<>
									<View
										style={{
											alignSelf: "center",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "column",
										}}
									>
										<LogoWmr height={80} width={200} />
										<View style={{ marginTop: -12 }}>
											<Text variant='heading3' style={{ fontSize: 24 }}>
												Companion
											</Text>
										</View>
									</View>
									<Text bold>{version}</Text>
									<Text bold style={{ textAlign: "center" }}>
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
									<Text>- Tournament Progress Management</Text>
									<Text>- Ability to save game results</Text>
									<Text>- Army List creator</Text>
									<View style={{ flexDirection: "row" }}>
										<AntDesign name='check' size={20} color='green' />
										<Text> -- Initial Creator complete</Text>
									</View>
									<View style={{ flexDirection: "row" }}>
										<AntDesign name='check' size={20} color='green' />
										<Text> -- Export Army Feature</Text>
									</View>
									<Text style={{ paddingLeft: 20 }}> -- All factions added</Text>
									<Text style={{ paddingLeft: 20 }}> -- Update Faction assets</Text>
								</>
							</TextBlock>
						</View>

						<View style={{ marginVertical: margin }}>
							<TextBlock>
								<Text>Thank you to the entire Warmaster Revolutions community for keeping this game alive!</Text>
								<Text>Credits: Forest Dragon Miniatures, Onmioji, K Rauff, Paintera Przemas Bak </Text>
							</TextBlock>
						</View>
						<View style={{ marginVertical: margin }}>
							<Text bold>
								Disclaimer: This is a fan-made hobby project and I have no affiliation with Games
								Workshop or its affiliates. This is non-commercial and I receive no financial gain for
								any content used in this product.
							</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
};

export default Home;

const styles = StyleSheet.create({
	dropdown: { padding: 8, borderRadius: 16 },
	image: {
		flex: 1,
		justifyContent: "center",
		height: Dimensions.get("screen").height,
		position: "absolute",
		top: 0,
		width: Dimensions.get("screen").width,
	},
});
