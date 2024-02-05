import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import Button from "@components/button";
import { useTranslation } from "react-i18next";
import { Language, useSettingsContext } from "@context/SettingsContext";
import MainContainerWithBlankBG from "@components/MainContainerWithBlankBG";
import { useTheme } from "@hooks/useTheme";
import { TextBlock, Text } from "@components/index";
import Checkbox from "expo-checkbox";
import { SelectCountry } from "react-native-element-dropdown";
import fonts from "@utils/fonts";
import FormLabel from "@components/forms/FormLabel";

const Preferences = () => {
	const { t } = useTranslation(["home", "common", "forms", "builder"]);
	const settings = useSettingsContext();
	const { theme } = useTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<MainContainerWithBlankBG>
				<View style={{ flex: 1, zIndex: 999, padding: 8 }}>
					{/* <View style={{ backgroundColor: theme.white, padding: 12, borderRadius: 8 }}>
						<FormLabel style={{ color: theme.textInverted }} label={t("Language", { ns: "common" })} />
						<SelectCountry
							data={[
								{
									value: "en",
									label: "English",
									image: require("../../../assets/images/lang_english.png"),
								},
								{
									value: "es",
									label: "Spanish",
									image: require("../../../assets/images/lang_spanish.png"),
								},
							]}
							selectedTextStyle={{ fontFamily: fonts.PTSansRegular }}
							value={Language[settings.settings.language]}
							valueField='value'
							labelField='label'
							imageField='image'
							imageStyle={{ borderRadius: 12 }}
							itemContainerStyle={{ padding: 8 }}
							onChange={(val) => settings.setLang(val.value)}
						/>
					</View> */}
					<View style={{ backgroundColor: theme.white, padding: 12, borderRadius: 8, marginTop: 12 }}>
						<FormLabel style={{ color: theme.textInverted }} label={t("BattleTracker", { ns: "common" })} />
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
							<TextBlock>
								<Text
									onPress={() => settings.setTwoPlayerMode()}
									style={{ fontSize: 16, color: theme.textInverted }}
								>
									{t("PreferencesDefaultSoloMode", { ns: "forms" })}
								</Text>
							</TextBlock>
							<Checkbox
								color={theme.accent}
								style={{ padding: 16, borderRadius: 20 }}
								value={settings.settings.trackerTwoPlayerMode}
								onValueChange={() => settings.setTwoPlayerMode()}
							/>
						</View>
						<TextBlock>
							<Text italic style={{ color: theme.textInverted }}>
								{t("PreferencesSoloModeDesc", { ns: "forms" })}
							</Text>
						</TextBlock>
					</View>
					<View style={{ backgroundColor: theme.white, padding: 12, borderRadius: 8, marginTop: 12 }}>
						<FormLabel style={{ color: theme.textInverted }} label={t("ArmyBuilder", { ns: "common" })} />
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
							<TextBlock>
								<Text
									onPress={() => settings.setTwoPlayerMode()}
									style={{ fontSize: 16, color: theme.textInverted }}
								>
									{t("PreferencesDefaultToShowStatline", { ns: "forms" })}
								</Text>
							</TextBlock>
							<Checkbox
								color={theme.accent}
								style={{ padding: 16, borderRadius: 20 }}
								value={settings.settings.showStatline}
								onValueChange={() => settings.setShowStatlineSetting()}
							/>
						</View>
						<TextBlock>
							<Text italic style={{ color: theme.textInverted }}>
								{t("PreferencesDefaultShowStatlineDesc", { ns: "forms" })}
							</Text>
						</TextBlock>
					</View>
				</View>
			</MainContainerWithBlankBG>
		</SafeAreaView>
	);
};

export default Preferences;
