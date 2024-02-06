import { Dimensions, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import React, { useTransition } from "react";
import CustomModal from "@components/CustomModal";
import { UnitProps } from "@utils/types";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import UnitIcon from "@components/UnitCards/UnitIcon";
import { sanitizeText } from "../../utils/builderHelpers";
import StatContainer from "./StatContainer";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

type UnitPreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUnitDetails: UnitProps;
};
const UnitPreview = ({ handleSetVisible, visible, selectedUnitDetails }: UnitPreviewProps) => {
	const { theme } = useTheme();
	const { t } = useTranslation(["common"]);
	const STAT_FONT_SIZE = 22;

	return (
		<CustomModal
			setModalVisible={() => {
				handleSetVisible(!visible);
			}}
			modalVisible={visible}
			headerTitle={selectedUnitDetails?.name}
		>
			<ScrollView style={{ display: "flex", flex: 1 }}>
				<View style={{ flexDirection: "column" }}>
					<View
						style={{
							flex: 1,
							marginBottom: 8,
						}}
					>
						<ImageBackground
							source={require("../../../../../assets/images/wm-bg2.jpeg")}
							resizeMode='cover'
							style={[
								styles.image,
								{ paddingVertical: 40 },
								{
									borderTopWidth: 2,
									borderBottomWidth: 2,
									borderTopColor: theme.white,
									borderBottomColor: theme.white,
								},
							]}
						>
							<LinearGradient
								colors={["rgba(31,46,39, 0.4)", "rgba(6,9,7, 0.9)"]}
								start={{ y: 0, x: 0.5 }}
								end={{ y: 0.5, x: 0 }}
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									bottom: -1,
									height: Dimensions.get("screen").height / 2,
									zIndex: 9,
								}}
							></LinearGradient>
							<View style={{ zIndex: 99, flex: 1, flexDirection: "column", alignItems: "center" }}>
								<UnitIcon
									size={"large"}
									type={selectedUnitDetails?.type}
									canShoot={selectedUnitDetails?.range == undefined ? false : true}
								/>
								<Text bold style={{ fontSize: 16 }}>
									{selectedUnitDetails?.type}
								</Text>
							</View>
						</ImageBackground>
					</View>
					<View
						style={{
							borderRadius: 4,
							paddingVertical: 8,
							padding: 8,
						}}
					>
						{selectedUnitDetails?.command ? (
							<View style={{ flex: 3, marginBottom: 8, justifyContent: "center", flexDirection: "row" }}>
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<StatContainer
										statName={"Command"}
										statValue={selectedUnitDetails.command.toString()}
									/>
								</View>
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<StatContainer
										statName={"Attack Bonus"}
										statValue={selectedUnitDetails.attack?.toString()}
									/>
								</View>
							</View>
						) : (
							<>
								<View
									style={{ flex: 3, marginBottom: 8, justifyContent: "center", flexDirection: "row" }}
								>
									<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
										<StatContainer
											statName={"Attack"}
											statValue={selectedUnitDetails.attack?.toString()}
										/>
									</View>
									{selectedUnitDetails?.range ? (
										<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
											<StatContainer
												statName={"Range"}
												statValue={selectedUnitDetails.range?.toString() || "-"}
											/>
										</View>
									) : null}
									<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
										<StatContainer
											statName={"Hits"}
											statValue={selectedUnitDetails.hits?.toString() || "-"}
										/>
									</View>
								</View>
								<View style={{ flexDirection: "row" }}>
									<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
										<StatContainer
											statName={"Armour"}
											statValue={selectedUnitDetails.armour?.toString() || "-"}
										/>
									</View>
									<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
										<StatContainer
											statName={"Size"}
											statValue={selectedUnitDetails.size?.toString() || "-"}
										/>
									</View>
								</View>
							</>
						)}
					</View>
					{selectedUnitDetails.specialRules && selectedUnitDetails.specialRules.length > 0 ? (
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column", padding: 12 }}>
							<View style={{ flex: 1, flexDirection: "column" }}>
								<View style={{ marginTop: 8 }}>
									<Text bold style={{ fontSize: 20, marginBottom: 8 }}>
										{t("SpecialRules")}
									</Text>
									{selectedUnitDetails.specialRules?.map((x) => {
										return x?.text?.map((rule, index) => {
											let sanitized = sanitizeText(rule, theme.text);
											return (
												<View key={index} style={{ marginBottom: 8 }}>
													<Text style={{ color: theme.text }}>{sanitized}</Text>
												</View>
											);
										});
									})}
								</View>
							</View>
						</View>
					) : null}
				</View>
			</ScrollView>
		</CustomModal>
	);
};

export default UnitPreview;
const styles = StyleSheet.create({
	image: {
		flex: 1,
		justifyContent: "center",
		top: 0,
	},
});
