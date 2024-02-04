import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import LogoWmr from "@components/SVGS/LogoWmr";
import { Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import MainContainer from "@components/MainContainerWithImage";
import MainContainerWithImage from "@components/MainContainerWithImage";
import { SafeAreaView } from "react-native-safe-area-context";

const Credits = () => {
	const { t } = useTranslation(["home", "common"]);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<MainContainerWithImage>
				<View style={{ flex: 1, zIndex: 9, alignItems: "center", justifyContent: "center" }}>
					<TextBlock variant='large'>
						<Text>{t("GeneralThanks")}</Text>
					</TextBlock>
					<TextBlock variant='large'>
						<Text>
							{t("SpecialMentions")}: Forest Dragon Miniatures, Onmioji, K Rauff, Paintera Przemas Bak, M
							Hobbes, Hardy
						</Text>
					</TextBlock>
				</View>
			</MainContainerWithImage>
		</SafeAreaView>
	);
};

export default Credits;

const styles = StyleSheet.create({});
