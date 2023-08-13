import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import Button from "@components/button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@navigation/Stacks/RootStack";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import LogoWmr from "@components/SVGS/LogoWmr";
import { LinearGradient } from "expo-linear-gradient";

const TrackerHome = () => {
	const { theme } = useTheme();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<ImageBackground
				source={require("../../../../assets/images/wmr_bg.png")}
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
				<View style={{ zIndex: 9, flex: 1, alignItems: "center", justifyContent: "center", padding: 8 }}>
					<View
						style={{
							marginTop: -200,
							alignSelf: "center",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							marginBottom: 20,
						}}
					>
						<LogoWmr height={80} width={200} />
						<View style={{ marginTop: -12 }}>
							<Text variant='heading3' style={{ fontSize: 24 }}>
								Battle Tracker
							</Text>
						</View>
					</View>
					<Text style={{ textTransform: "uppercase", textAlign: "center" }}>Track victory points</Text>
					<View style={{ marginBottom: 16 }}>
						<>
							<Text style={{ textAlign: "center" }}>
								Record victory points by selecting your opponents faction units/magic items.{" "}
							</Text>
						</>
					</View>
					<Text style={{ textTransform: "uppercase", textAlign: "center" }}>
						Calculate Combat resolutions
					</Text>
					<View style={{ marginBottom: 16 }}>
						<>
							<Text style={{ textAlign: "center" }}>
								Use the cambat tracker to quickly calculate combat casualties and supports.{" "}
							</Text>
						</>
					</View>
					<Text style={{ textTransform: "uppercase", textAlign: "center" }}>Access lookup charts</Text>

					<View style={{ marginBottom: 16 }}>
						<>
							<Text style={{ textAlign: "center" }}>View lookup charts with ease</Text>
						</>
					</View>
					<View style={{ marginTop: 20 }}>
						<Button
							size={"lg"}
							onPress={() => navigation.navigate("TrackerStackNavigator")}
							variant={"confirm"}
						>
							<Text bold style={{ color: theme.black }}>
								New Battle!
							</Text>
						</Button>
					</View>
				</View>
			</ImageBackground>
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
