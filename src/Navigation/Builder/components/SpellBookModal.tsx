import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import CustomModal from "@components/CustomModal";
import { SpellsProps } from "@utils/types";
import { Text } from "@components/index";
import CollapsibleComponent from "./Collapsible";
import { useTheme } from "@hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { sanitizeText } from "../utils/builderHelpers";
import { useTranslation } from "react-i18next";

type SpellBookModalProps = {
	handleSetVisible: (visible: boolean) => void;
	visible: boolean;
	spells: SpellsProps[];
};
const SpellBookModal = ({ handleSetVisible, visible, spells }: SpellBookModalProps) => {
	const {t} = useTranslation(["builder"])
	const { theme } = useTheme();
	const renderDiceIcon = (value?: number) => {
		switch (value) {
			case 2:
				return <FontAwesome5 name='dice-two' size={16} color='black' />;

			case 3:
				return <FontAwesome5 name='dice-three' size={16} color='black' />;
			case 4:
				return <FontAwesome5 name='dice-four' size={16} color='black' />;
			case 5:
				return <FontAwesome5 name='dice-five' size={16} color='black' />;
			case 6:
				return <FontAwesome5 name='dice-six' size={16} color='black' />;
			default:
				return <FontAwesome5 name='dice-d6' size={16} color='black' />;
		}
	};
	return (
		<CustomModal
			setModalVisible={() => {
				handleSetVisible(!visible);
			}}
			modalVisible={visible}
			headerTitle={t("SpellBook")}
		>
			<View>
				<FlatList
					data={spells}
					renderItem={({ item, index }) => {
						return (
							<CollapsibleComponent
								headerLeftComponent={
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											justifyContent: "flex-start",
											alignItems: "center",
										}}
									>
										<View style={{flex: 1}}>
											<View style={{ flexDirection: "column" }}>
												<View style={{ flexDirection: "row", alignItems: "center" }}>
													{renderDiceIcon(item.roll)}
													<View style={{ marginLeft: 8 }}>
														<Text style={{ fontSize: 16, color: theme.black }}>
															{item.roll}+
														</Text>
													</View>
												</View>
												<View style={{ flexDirection: "row", alignItems: "center" }}>
													<Entypo name='ruler' size={16} color='black' />
													<View style={{ marginLeft: 8 }}>
														<Text style={{ color: theme.black }}>
															{item.range ? item.range : "-"}
														</Text>
													</View>
												</View>
											</View>
										</View>
										<View style={{ flex: 2, justifyContent: 'flex-start'}}>
											<Text bold style={{ fontSize: 16, color: theme.black }}>
												{item.name}
											</Text>
										</View>
									</View>
								}
								collapsableContent={
									<View style={{ flexDirection: "column", marginVertical: 12 }}>
										{item.text?.map((x) => {
											let _item = x;
											const sanitized = sanitizeText(_item,theme.black)
											return <Text style={{ color: theme.black }}>{sanitized}</Text>;
										})}
									</View>
								}
							/>
						);
					}}
				/>
			</View>
		</CustomModal>
	);
};

export default SpellBookModal;

const styles = StyleSheet.create({});
