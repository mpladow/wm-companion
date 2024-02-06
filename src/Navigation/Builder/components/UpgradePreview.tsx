import { Dimensions, FlatList, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";

type UpgradePreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUpgradeDetails?: UpgradesProps;
};
const UpgradePreview = ({ handleSetVisible, visible, selectedUpgradeDetails }: UpgradePreviewProps) => {
	const STAT_FONT_SIZE = 22;
	const { theme } = useTheme();

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
						<ImageBackground
							source={require("../../../../assets/images/wm-bg2.jpeg")}
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
									bottom: -0,
									height: Dimensions.get("screen").height / 2,
									zIndex: 9,
								}}
							></LinearGradient>
							<View style={{ zIndex: 99, flex: 1, flexDirection: "column", alignItems: "center" }}>
								<UpgradeIcon type={selectedUpgradeDetails?.type as UpgradeTypes} />

								<Text bold style={{ fontSize: 16 }}>
									{selectedUpgradeDetails?.type}
								</Text>
							</View>
						</ImageBackground>
					</View>
					{/* <View style={{ flex: 1, marginBottom: 8 }}>
						<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
							<UpgradeIcon type={selectedUpgradeDetails?.type as UpgradeTypes} />
							<Text bold style={{ fontSize: 16 }}>
								{selectedUpgradeDetails?.type}
							</Text>
						</View>
					</View> */}
					<View style={{ padding: 12 }}>
						{selectedUpgradeDetails?.attack ? (
							<View
								style={{
									flex: 3,
									marginBottom: 8,
									justifyContent: "center",
									flexDirection: "row",
								}}
							>
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
				</View>
			</ScrollView>
		</CustomModal>
	);
};

export default UpgradePreview;

const styles = StyleSheet.create({
	image: {
		flex: 1,
		justifyContent: "center",
		top: 0,
	},
});
