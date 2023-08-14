import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "@components/CustomModal";
import { SpellsProps, UnitProps } from "@utils/types";
import { Text } from "@components/index";
import CollapsibleComponent from "./Collapsible";
import { useTheme } from "@hooks/useTheme";
import { useBuilderContext } from "@context/BuilderContext";
import UnitIcon from "@components/UnitCards/UnitIcon";
import { getGenericSpecialRules } from "@utils/factionHelpers";
import reactStringReplace from "react-string-replace";
import { underscoreRegex } from "@utils/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type UnitPreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUnitDetails: UnitProps;
};
const UnitPreview = ({ handleSetVisible, visible, selectedUnitDetails }: UnitPreviewProps) => {
	const { theme } = useTheme();
	const builder = useBuilderContext();
	const [headerTitle, setHeaderTitle] = useState(selectedUnitDetails?.name);
	const [specialRules, setSpecialRules] = useState<any>();

	const underscoreRegex = /_(.*?)_/g;

	useEffect(() => {
		selectedUnitDetails && setHeaderTitle(selectedUnitDetails.name);
		// get special rules
		if (builder.factionDetails?.specialRules && selectedUnitDetails?.name) {
			//@ts-ignore - TODO: need to check typing
			const _specialRules = builder.factionDetails?.specialRules[selectedUnitDetails?.name];
			const _genericSpecialRules = getGenericSpecialRules();
			const specialRulesExist = _genericSpecialRules[selectedUnitDetails?.name];
			if (_specialRules?.text != undefined) {
				setSpecialRules(_specialRules);
			} else if (specialRulesExist != undefined) setSpecialRules(specialRulesExist);
			else {
				setSpecialRules(null);
			}
		}
	}, [selectedUnitDetails]);

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

					{specialRules ? (
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column" }}>
							<View style={{ flex: 1, flexDirection: "column" }}>
								<View style={{marginTop: 8}}>
								<Text bold style={{ fontSize: 16 }}>
									Special Rules
								</Text>
									{specialRules &&
										specialRules?.text.map((x) => {
											// transform content to remove __
											const sanitized = reactStringReplace(x, underscoreRegex, (match, i) => {
												console.log(match, `${match} on ${i}`);
												return (
													<Text bold style={{ color: theme.text }} key={i}>
														{match}ß
													</Text>
												);
											});

											return (
												<View>
													<Text style={{ color: theme.text }}>{sanitized}</Text>
												</View>
											);
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

const styles = StyleSheet.create({});
