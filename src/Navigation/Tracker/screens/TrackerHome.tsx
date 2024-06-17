import { Dimensions, ImageBackground, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import Button from "@components/button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import LogoWmr from "@components/SVGS/LogoWmr";
import { useVictoryPoints, VPContextProvider } from "@context/VPContext";
import { TrackerStackParamList } from "@navigation/Stacks/TrackerStackNavigator";
import { useTranslation } from "react-i18next";
import MainContainerWithImage from "@components/MainContainerWithImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { HEADER_HEIGHT } from "src/constants/styling";

const TrackerHome = () => {
	const { theme } = useTheme();
	const navigation = useNavigation<NativeStackNavigationProp<TrackerStackParamList>>();
	const vpContext = useVictoryPoints();
	const { t } = useTranslation(["tracker", "home"]);

	const onBlunderPress = () => {
		navigation.navigate("Blunders");
	};
	const onScoutingPress = () => {
		navigation.navigate("Scouting");
	};
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<MainContainerWithImage>
				<View
					style={{
						height: "100%",
						zIndex: 9,
						alignItems: "center",
						justifyContent: "space-between",
						padding: 8,
						paddingBottom: Platform.OS == "ios" ? 50 + 90 : 50 + 100,
					}}
				>
					<View
						style={{
							marginTop: HEADER_HEIGHT - 8,
							alignSelf: "center",
							alignItems: "center",
							flexDirection: "column",
							marginBottom: 20,
						}}
					>
						<LogoWmr height={80} width={200} />
						<View style={{ marginTop: -12 }}>
							<Text variant='heading3' style={{ fontSize: 24 }}>
								{t("BattleTracker")}
							</Text>
						</View>
					</View>
					<View>
						<Text style={{ textTransform: "uppercase", textAlign: "center" }}>
							{t("TrackVictoryPointsHeader")}
						</Text>
						<View style={{ marginBottom: 16 }}>
							<>
								<Text style={{ textAlign: "center" }}>{t("TrackVictoryPointsDescription")}</Text>
							</>
						</View>
						<Text style={{ textTransform: "uppercase", textAlign: "center" }}>
							{t("CalculateCombatResolutionsHeader")}
						</Text>
						<View style={{ marginBottom: 16 }}>
							<>
								<Text style={{ textAlign: "center" }}>{t("CalculateCombatResolutionDescription")}</Text>
							</>
						</View>
						<Text style={{ textTransform: "uppercase", textAlign: "center" }}>
							{t("AccessLookupChartsHeader")}
						</Text>
						<View style={{ flexDirection: "row", paddingTop: 8, justifyContent: "center" }}>
							<Button onPress={onScoutingPress} variant={"default"}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<FontAwesome name='binoculars' size={20} color={theme.text} />
									<Text style={{ marginLeft: 4 }}>Scouting Chart</Text>
								</View>
							</Button>
							<View style={{ padding: 8 }}></View>
							<Button onPress={onScoutingPress} variant={"default"}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Ionicons name='warning' size={24} color={theme.text} />
									<Text style={{ marginLeft: 4 }}>Blunder Chart</Text>
								</View>
							</Button>
						</View>
					</View>
					<View>
						<View style={{ marginTop: 20 }}>
							<Button size={"lg"} onPress={() => navigation.navigate("Tracker")} variant={"confirm"}>
								<Text bold style={{ color: theme.black }}>
									{t("NewBattle")}
								</Text>
							</Button>
							{/* <View>
							{vpContext?.allSaves?.map((s) => {
								return <Text style={theme.text}>{s.saveGameId}</Text>;
							})}
						</View> */}
						</View>
					</View>
				</View>
			</MainContainerWithImage>
		</SafeAreaView>
	);
};

export default TrackerHome;

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
