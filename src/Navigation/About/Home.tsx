import {
	Dimensions,
	ImageBackground,
	Platform,
	Pressable,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Button, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "@context/SettingsContext";
import { useNavigation } from "@react-navigation/native";
import IconButton from "@components/IconButton";
import { EvilIcons } from "@expo/vector-icons";
import MainContainerWithImage from "@components/MainContainerWithImage";
import LogoWmr from "@components/SVGS/LogoWmr";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const version = Constants?.expoConfig?.version;

	const toast = useToast();
	const handlePressSupport = () => {
		Linking.openURL(
			"https://www.paypal.com/donate/?business=2D9BN2Z8BVZH8&no_recurring=0&item_name=To+maintain+the+Apple+Developer+Licence+(approx+150aud+per+year)&currency_code=AUD"
		);
	};
	const handleEmailPress = async () => {
		toast.show("Email Copied!");
		await Clipboard.setStringAsync("ml.development.2022@gmail.com");
		const platformDetails = Platform.OS;
		Linking.openURL(
			`mailto:ml.development.2022@gmail.com?subject=${encodeURIComponent(
				`WM-Companion Bug Report - ${platformDetails}`
			)}&body=${encodeURIComponent(
				`Please provide brief description of the issue, and any notes on how to replicate it.`
			)}`
		);
	};
	const { t } = useTranslation(["home", "common"]);

	const settings = useSettingsContext();
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<MainContainerWithImage>
				<View style={{ zIndex: 9, flex: 1, padding: 16 }}>
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
										{t("Companion", { ns: "common" })}
									</Text>
								</View>
							</View>
						</>
					</TextBlock>
					<View style={{ justifyContent: "space-between" }}>
						<TextBlock variant='large'>
							<Text>{t("Tagline")}</Text>
						</TextBlock>
						{/* <TextBlock variant='large'>
						<>
							<Text variant='heading2'>Feedback</Text>
							<Text>{t("BugFeedback")}: </Text>
							<TouchableOpacity onPress={handleEmailPress}>
								<Text style={{ color: theme.white }}>ml.development.2022@gmail.com</Text>
							</TouchableOpacity>
						</>
					</TextBlock> */}
						<TextBlock variant='large'>
							<Text bold>{t("Disclaimer")}</Text>
						</TextBlock>
						<TextBlock variant='large'>
							<Text bold>
								{t("AppVersion", { ns: "common" })}: {version}
							</Text>
						</TextBlock>
						<View style={{ paddingVertical: 4 }}>
							<IconButton
								onPress={() => navigation.navigate("Preferences")}
								variant={"primary"}
								title={t("Preferences", { ns: "common" })}
								icon={<EvilIcons name='gear' size={24} color='black' />}
								isStackNavigation={true}
							></IconButton>
						</View>

						<View style={{ paddingVertical: 8 }}>
							<IconButton
								onPress={() => navigation.navigate("Credits")}
								variant={"primary"}
								title={t("Credits", { ns: "common" })}
								icon={<MaterialCommunityIcons name='hand-clap' size={24} color='black' />}
								isStackNavigation={true}
							></IconButton>
						</View>
						<View style={{ paddingVertical: 8 }}>
							<IconButton
								onPress={() => handleEmailPress()}
								variant={"primary"}
								title={t("ReportBug", { ns: "common" })}
								icon={<Ionicons name='bug-outline' size={24} color='black' />}
								isNewWindow={true}
							></IconButton>
						</View>
						{Platform.OS == "android" ? (
							<View style={{ marginVertical: margin * 3 }}>
								<Button onPress={handlePressSupport} variant={"primary"}>
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<View style={{ marginRight: 8 }}>
											<Entypo name='paypal' size={24} color={theme.text} />
										</View>

										<Text bold>{t("SupportDevelopment", {ns: "home"})}</Text>
									</View>
								</Button>
							</View>
						) : null}
					</View>
				</View>
			</MainContainerWithImage>
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
