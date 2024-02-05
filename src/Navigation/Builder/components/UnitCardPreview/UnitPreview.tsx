import { ScrollView, StyleSheet, View } from "react-native";
import React, { useTransition } from "react";
import CustomModal from "@components/CustomModal";
import { UnitProps } from "@utils/types";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import UnitIcon from "@components/UnitCards/UnitIcon";
import { sanitizeText } from "../../utils/builderHelpers";
import StatContainer from "./StatContainer";
import { useTranslation } from "react-i18next";

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
					<View style={{ flex: 1, marginBottom: 8 }}>
						<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
							<UnitIcon
								type={selectedUnitDetails?.type}
								canShoot={selectedUnitDetails?.range == undefined ? false : true}
							/>
							<Text bold style={{ fontSize: 16 }}>
								{selectedUnitDetails?.type}
							</Text>
						</View>
					</View>
					<View
						style={{
							borderRadius: 4,
							paddingVertical: 8,
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
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column" }}>
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
