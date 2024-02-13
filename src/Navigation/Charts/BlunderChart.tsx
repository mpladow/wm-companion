import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { ModalContainer, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const BlunderChart = () => {
	const { t } = useTranslation(["charts", "common"]);
	const { theme } = useTheme();
	const navigation = useNavigation();
	return (
		<ModalContainer
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={t("Blunders", {ns: "charts"})}
			footerRight={<Text>pg 61</Text>}
		>
			<ScrollView style={{ display: "flex", flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								1
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 5 }}>
						<TextBlock>
							<Text bold italic style={{ fontSize: fontSize.lg }}>
								{t("blunder1Title")}
							</Text>
						</TextBlock>
						<TextBlock>
							<Text>{t("blunder1Description1")}</Text>
						</TextBlock>
						<TextBlock variant='small'>
							<Text>{t("blunder1Description2")}</Text>
						</TextBlock>
						<TextBlock variant='small'>
							<Text> {t("blunder1Description3")}</Text>
						</TextBlock>
					</View>
				</View>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								2 - 3
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 5 }}>
						<TextBlock>
							<Text bold italic style={{ fontSize: fontSize.lg }}>
								{t("blunder2Title")}
							</Text>
						</TextBlock>
						<TextBlock>
							<Text>{t("blunder2Description1")}</Text>
						</TextBlock>
						<TextBlock variant='small'>
							<Text>{t("blunder2Description2")}</Text>
						</TextBlock>
						<TextBlock variant='small'>
							<Text>{t("blunder2Description1")}</Text>
						</TextBlock>
					</View>
				</View>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								4 - 5
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 5 }}>
						<TextBlock>
							<Text bold italic style={{ fontSize: fontSize.lg }}>
								{t("blunder3Title")}
							</Text>
						</TextBlock>
						<TextBlock>
							<Text>{t("blunder3Description1")}</Text>
						</TextBlock>
					</View>
				</View>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								6
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 5 }}>
						<TextBlock>
							<Text bold italic style={{ fontSize: fontSize.lg }}>
								{t("blunder4Title")}
							</Text>
						</TextBlock>
						<TextBlock>
							<Text>{t("blunder4Description1")}</Text>
						</TextBlock>
						<TextBlock>
							<Text>{t("blunder4Description2")}</Text>
						</TextBlock>
					</View>
				</View>
			</ScrollView>
		</ModalContainer>
	);
};

export default BlunderChart;
