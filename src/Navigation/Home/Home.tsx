import { Dimensions, ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Button, Text, TextBlock } from "@components/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { margin } from "@utils/constants";
import Constants from "expo-constants";
import LogoWmr from "@components/SVGS/LogoWmr";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";

const Home = () => {
	const { theme } = useTheme();
	const version = Constants?.manifest?.version;
	const toast = useToast();
	const handlePressSupport = () => {
		Linking.openURL(
			"https://www.paypal.com/donate/?business=2D9BN2Z8BVZH8&no_recurring=0&item_name=To+maintain+the+Apple+Developer+Licence+(approx+150aud+per+year)&currency_code=AUD"
		);
	};
	const handleEmailPress = async () => {
		toast.show("Email Copied!");
		await Clipboard.setStringAsync("ml.development.2022@gmail.com");
	};
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
							<TextBlock variant='large'>
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
								</>
							</TextBlock>
							<TextBlock variant='large'>
								<Text>A companion app to assist in Warmaster and Warmaster Revolution wargaming.</Text>
							</TextBlock>

							<TextBlock variant='large'>
								<>
									<Text variant='heading2'>Credits</Text>
									<Text>
										Thank you to the entire Warmaster Revolutions community for keeping this game
										alive!
									</Text>
									<Text>
										Special mentions to Forest Dragon Miniatures, Onmioji, K Rauff, Paintera Przemas
										Bak, M Hobbes, Hardy
									</Text>
								</>
							</TextBlock>
							<TextBlock variant='large'>
								<>
									<Text variant='heading2'>Feedback</Text>
									<Text>If any bugs are found, please report them to: </Text>
									<TouchableOpacity onPress={handleEmailPress}>
										<Text style={{ color: theme.white }}>ml.development.2022@gmail.com</Text>
									</TouchableOpacity>
								</>
							</TextBlock>
						</View>
						<View style={{ marginVertical: margin }}>
							<Text bold>
								Disclaimer: This is a non-commercial, fan-made hobby project and I have no affiliation
								with Games Workshop or its affiliates.
							</Text>
						</View>
						<View style={{ marginVertical: margin * 3 }}>
							<Button onPress={handlePressSupport} variant={"primary"}>
								<View style={{ flexDirection: "row", alignItems: 'center' }}>
									<View style={{marginRight: 8}}>
										<Entypo name='paypal' size={24} color={theme.text} />
									</View>
									<Text>Support Development</Text>
								</View>
							</Button>
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
