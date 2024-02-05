import { ImageBackground, StyleSheet, Image, TouchableOpacity, View } from "react-native";
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
		<MainContainerWithImage>
			<View style={{ flex: 1, zIndex: 9, justifyContent: "center", padding: 12, paddingTop: 0, marginTop: -100 }}>
				{/* <View style={{ height: 100 , backgroundColor: "green"}}>
						<Image
							style={{ width: 50, height: 50 }}
							source={{ uri: "https://giphy.com/stickers/goblin-gobbo-slowquest-IK1nFzxLlFcZcLMV0q" }}
						/>
					</View> */}
				<TextBlock variant='large'>
					<Text>{t("GeneralThanks")}</Text>
				</TextBlock>
				<TextBlock variant='large'>
					<Text>
						<Text bold>{t("SpecialMentionsForSculptors")}</Text>: Forest Dragon Miniatures, Onmioji,
						Greenskin Miniatures, GW, Wakes Emporium
					</Text>
				</TextBlock>
				<TextBlock variant='large'>
					<Text>
						<Text bold>{t("SpecialMentionsForImages")}</Text>: K Rauff, Przemas Bak, M Hobbes, Hardy,
						Alexander Carraro, Mattias R, Byron L, Kristoffer Rauff, Geoff A,
					</Text>
				</TextBlock>
			</View>
		</MainContainerWithImage>
	);
};

export default Credits;

const styles = StyleSheet.create({});
