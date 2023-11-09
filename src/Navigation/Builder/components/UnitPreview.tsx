import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import CustomModal from "@components/CustomModal";
import { UnitProps } from "@utils/types";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import UnitIcon from "@components/UnitCards/UnitIcon";
import { sanitizeText } from "../utils/builderHelpers";

type UnitPreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUnitDetails: UnitProps;
};
const UnitPreview = ({ handleSetVisible, visible, selectedUnitDetails }: UnitPreviewProps) => {
	const { theme } = useTheme();

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
					{selectedUnitDetails?.command ? (
						<View style={{ flex: 3, marginBottom: 8, justifyContent: "center", flexDirection: "row" }}>
							<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
								<Text style={{ fontSize: 20 }}>Command</Text>
								<Text bold style={{ fontSize: STAT_FONT_SIZE }}>
									{selectedUnitDetails?.command}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
								<Text style={{ fontSize: 20 }}>Attack Bonus</Text>
								<Text bold style={{ fontSize: STAT_FONT_SIZE }}>
									{selectedUnitDetails.attack}
								</Text>
							</View>
						</View>
					) : (
						<>
							<View style={{ flex: 3, marginBottom: 8, justifyContent: "center", flexDirection: "row" }}>
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<Text>Attack</Text>
									<Text style={{ fontSize: STAT_FONT_SIZE }}>{selectedUnitDetails?.attack}</Text>
								</View>
								{selectedUnitDetails?.range ? (
									<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
										<Text>Range</Text>
										<Text style={{ fontSize: STAT_FONT_SIZE }}>
											{selectedUnitDetails?.range || "-"}
										</Text>
									</View>
								) : null}
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<Text>Hits</Text>
									<Text style={{ fontSize: STAT_FONT_SIZE }}>{selectedUnitDetails?.hits}</Text>
								</View>
							</View>
							<View style={{ flexDirection: "row" }}>
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<Text>Armour</Text>
									<Text style={{ fontSize: STAT_FONT_SIZE }}>
										{selectedUnitDetails?.armour || "-"}
									</Text>
								</View>
								<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
									<Text>Size</Text>
									<Text style={{ fontSize: STAT_FONT_SIZE }}>{selectedUnitDetails?.size}</Text>
								</View>
							</View>
						</>
					)}

					{selectedUnitDetails.specialRules && selectedUnitDetails.specialRules.length > 0 ? (
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column" }}>
							<View style={{ flex: 1, flexDirection: "column" }}>
								<View style={{ marginTop: 8 }}>
									<Text bold style={{ fontSize: 20, marginBottom: 8 }}>
										Special Rules
									</Text>
									{selectedUnitDetails.specialRules?.map((x) => {
										return x.text?.map((rule, index) => {
											let sanitized = sanitizeText(rule, theme.text);
											return (
												<View key={index} style={{marginBottom: 8}}>
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