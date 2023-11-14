import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "@components/CustomModal";
import { SpellsProps, UnitProps, UpgradesProps } from "@utils/types";
import { Text } from "@components/index";
import CollapsibleComponent from "./Collapsible";
import { useTheme } from "@hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useBuilderContext } from "@context/BuilderContext";
import UpgradeIcon from "@components/UnitCards/UpgradeIcon";
import { UpgradeTypes } from "@utils/constants";

type UpgradePreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUpgradeDetails?: UpgradesProps;
};
const UpgradePreview = ({ handleSetVisible, visible, selectedUpgradeDetails }: UpgradePreviewProps) => {
	const STAT_FONT_SIZE = 22;

	return (
		<CustomModal
			setModalVisible={() => {
				handleSetVisible(!visible);
			}}
			modalVisible={visible}
			headerTitle={selectedUpgradeDetails?.name}
		>
			<ScrollView style={{ display: "flex", flex: 1 }}>
				<View style={{ flexDirection: "column" }}>
					<View style={{ flex: 1, marginBottom: 8 }}>
						<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
							<UpgradeIcon type={selectedUpgradeDetails?.type as UpgradeTypes} />
							<Text bold style={{ fontSize: 16 }}>
								{selectedUpgradeDetails?.type}
							</Text>
						</View>
					</View>
					{selectedUpgradeDetails?.attack ? (
						<View style={{ flex: 3, marginBottom: 8, justifyContent: "center", flexDirection: "row" }}>
							<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
								<Text>Attack</Text>
								<Text style={{ fontSize: STAT_FONT_SIZE }}>{selectedUpgradeDetails?.attack}</Text>
							</View>
						</View>
					) : null}

					{selectedUpgradeDetails && selectedUpgradeDetails?.text?.length > 0 ? (
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column" }}>
							<View style={{ flex: 1, flexDirection: "column" }}>
								{selectedUpgradeDetails?.text?.map((x) => {
									if (x)
										return (
											<View style={{ marginBottom: 8, alignItems: "flex-start" }}>
												<Text>{x}</Text>
											</View>
										);
								})}
							</View>
						</View>
					) : null}
				</View>
			</ScrollView>
		</CustomModal>
	);
};

export default UpgradePreview;

const styles = StyleSheet.create({});
