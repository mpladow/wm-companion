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

type UpgradePreviewProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	selectedUpgradeDetails?: UpgradesProps;
};
const UpgradePreview = ({ handleSetVisible, visible, selectedUpgradeDetails }: UpgradePreviewProps) => {
	const { theme } = useTheme();
	const builder = useBuilderContext();
	const [headerTitle, setHeaderTitle] = useState(selectedUpgradeDetails?.name);
	const [specialRules, setSpecialRules] = useState<UpgradesProps>();

useEffect(() => {
  console.log(`specialRuless: ${JSON.stringify(specialRules)}`)

}, [])

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
							<Text bold style={{ fontSize: 16 }}>
								{selectedUpgradeDetails?.type}
							</Text>
						</View>
					</View>

					{selectedUpgradeDetails ? (
						<View style={{ flex: 3, justifyContent: "center", flexDirection: "column" }}>
							<View style={{ flex: 1, flexDirection: "column" }}>

								{selectedUpgradeDetails?.text?.map((x) => {
									if (x)
										return (
											<View style={{ marginBottom: 4, alignItems: "flex-start" }}>
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
