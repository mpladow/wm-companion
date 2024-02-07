import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { ModalContainer, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const ScoutingChart = () => {
	const { theme } = useTheme();
	const { t } = useTranslation(["charts", "common", "units"]);
	const navigation = useNavigation();
	return (
		<ModalContainer
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={t("Scouting", {ns: "charts"})}
			footerRight={<Text>pg 82</Text>}
		>
			<>
				<View style={{ marginBottom: 12 }}>
					<TextBlock>
						<Text>{t("scoutingGeneralDescription1")}</Text>
					</TextBlock>
					<TextBlock>
						<Text>{t("scoutingGeneralDescription2")}</Text>
					</TextBlock>
					<TextBlock>
						<Text>{t("scoutingGeneralDescription3")}</Text>
					</TextBlock>
					<TextBlock>
						<Text>{t("scoutingGeneralDescription4")}</Text>
					</TextBlock>
					<TextBlock>
						<Text bold>{t("scoutingGeneralDescription5")}</Text>
					</TextBlock>
				</View>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								{t("Role")}
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								{t("ScoutingPoints")}
							</Text>
						</TextBlock>
					</View>
				</View>
				<ScrollView style={{ display: "flex", flex: 1 }} showsVerticalScrollIndicator={false}>
					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										{t("Flyers", { ns: "common" })}
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										3
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text style={{ fontSize: fontSize.md }}>{t("FlyingUnitsDesc1")}</Text>
									<Text italic>
										{t("FlyingUnitExamples", {
											example1: t("Dwarves.Rangers", { ns: "units" }),
											example2: t("Ratmen.GutterRunners", { ns: "units" }),
											example3: t("Ogres.Gorgers", { ns: "units" }),
											example4: t("WoodElves.Waywatchers", { ns: "units" }),
										})}
									</Text>
								</TextBlock>
							</View>
						</View>
					</View>
					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										{t("Scouts")}
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										2
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<>
										<Text style={{ fontSize: fontSize.md }}>{t("ScoutsDesc1")}</Text>
										<Text italic>
											{t("ScoutsExamples", {
												example1: t("Undead.EtherealHost", { ns: "units" }),
												example2: t("Beastmen.Centigors", { ns: "units" }),
												example3: t("Chaos.Warhounds", { ns: "units" }),
												example4: t("Beastmen.Beastherd", { ns: "units" }),
												example5: t("Beastmen.Herdkin", { ns: "units" }),
												example6: t("Empire.Skirmishers", { ns: "units" }),
											})}
										</Text>
									</>
								</TextBlock>
							</View>
						</View>
					</View>

					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										{t("Patrols")}
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										1
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text style={{ fontSize: fontSize.md }}>{t("PatrolsDesc1")}</Text>
									<Text italic>
										{t("PatrolsExamples", {
											example1: t("Ratmen.RatSwarms", { ns: "units" }),
											example2: t("Lizardmen.Skinks", { ns: "units" }),
										})}
									</Text>
								</TextBlock>
							</View>
						</View>
					</View>
				</ScrollView>
			</>
		</ModalContainer>
	);
};

export default ScoutingChart;
