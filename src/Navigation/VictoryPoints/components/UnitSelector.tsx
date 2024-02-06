import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useEffect, useState, useTransition } from "react";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { useVictoryPoints, VPScoreProps } from "@context/VPContext";
import { Button, CustomDropdown, Text, TextBlock } from "@components/index";
import fonts from "@utils/fonts";
import { useTranslation } from "react-i18next";

type UnitSelectorProps = {
	ddFactions: DropDownItemProps[];
	ddUnits?: DropDownItemProps[];
	ddMagicItems?: DropDownItemProps[];
	factionSelection?: number;
	unitSelection?: DropDownItemProps;
	magicItemsSelections?: any[];
	handleSetFactionSelection: (item: any) => void;
	handleSetUnitSelection: (item: any) => void;
	handleSetMagicItemsSelection: (item: any) => void;
	multiSelectRef: any;
	addUnitPressed: (isHalfPoints: boolean) => void;
	useOnePlayer: boolean;
};
const UnitSelector = forwardRef(
	({
		ddFactions,
		ddUnits,
		ddMagicItems,
		handleSetFactionSelection,
		handleSetUnitSelection,
		handleSetMagicItemsSelection,
		factionSelection,
		unitSelection,
		magicItemsSelections,
		multiSelectRef,
		addUnitPressed,
		useOnePlayer,
	}: UnitSelectorProps) => {
		const { t } = useTranslation(["tracker", "common", "forms"]);
		const { theme } = useTheme();
		const [defaultFaction, setDefaultFaction] = useState<DropDownItemProps>();
		const [disableAddButton, setDisableAddButton] = useState(true);
		useEffect(() => {
			const faction = ddFactions.find((x) => x.value == factionSelection);
			setDefaultFaction(faction);
		}, [factionSelection, ddFactions]);
		useEffect(() => {
			if (factionSelection == null || unitSelection == null) {
				setDisableAddButton(true);
			} else {
				setDisableAddButton(false);
			}
		}, [factionSelection, unitSelection]);
		return (
			<View>
				<View style={[{ marginBottom: 4 }]}>
					<CustomDropdown
						value={defaultFaction}
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						containerStyle={[
							!useOnePlayer && { transform: [{ rotate: "180deg" }], height: 200 },
							!useOnePlayer && Platform.OS == "android" && { left: 24, bottom: 80 },
						]}
						dropdownPosition={!useOnePlayer ? "top" : "bottom"}
						transformOrigin={"center"}
						placeholder={t("SelectFaction", { ns: "forms" })}
						placeholderStyle={{ color: "#ddd" }}
						data={ddFactions}
						labelField='label'
						valueField='value'
						onChange={(item: any) => {
							handleSetFactionSelection(item.value);
						}}
					/>
				</View>
				<View style={{ marginBottom: 4 }}>
					<CustomDropdown
						placeholder={t("SelectUnit", { ns: "forms" })}
						placeholderStyle={{ color: "#ddd" }}
						disable={factionSelection == undefined}
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						containerStyle={[
							!useOnePlayer && { transform: [{ rotate: "180deg" }], height: 200 },
							!useOnePlayer && Platform.OS == "android" && { left: 24, bottom: 80 },
						]}
						transformOrigin={"center"}
						dropdownPosition={!useOnePlayer ? "top" : "bottom"}
						data={ddUnits ? ddUnits : []}
						labelField='label'
						valueField='value'
						onChange={(item) => handleSetUnitSelection(item)}
						value={unitSelection}
					/>
				</View>
				<View style={{ marginBottom: 4 }}>
					<MultiSelect
						ref={multiSelectRef}
						placeholder={t("SelectMagicItems", { ns: "forms" })}
						placeholderStyle={{ color: "#ddd" }}
						selectedTextStyle={styles.selectedTextStyle}
						selectedStyle={{ backgroundColor: "blue" }}
						containerStyle={[
							!useOnePlayer && { transform: [{ rotate: "180deg" }], height: 200 },
							!useOnePlayer && Platform.OS == "android" && { left: 24, bottom: 80 },
						]}
						dropdownPosition={!useOnePlayer ? "top" : "bottom"}
						searchPlaceholder='Search...'
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						data={ddMagicItems ? ddMagicItems : []}
						labelField='label'
						valueField='value'
						fontFamily={fonts.PTSansBold}
						disable={unitSelection == null}
						onChange={(item) => {
							console.log(item, "MAGIC ITEM SELECTED");
							handleSetMagicItemsSelection(item);
							multiSelectRef?.current?.close();
						}}
						value={magicItemsSelections}
						renderSelectedItem={(item, unSelect) => (
							<TouchableOpacity onPress={() => unSelect && unSelect(item)}>
								<View style={styles.selectedStyle}>
									<Text style={styles.textSelectedStyle}>{item.label}</Text>
									<AntDesign color='black' name='delete' size={17} />
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
				<View
					style={{
						flexDirection: "row",
						marginTop: 4,
						justifyContent: "space-between",
						alignContent: "center",
					}}
				>
					<View style={{ flex: 1, margin: 4 }}>
						<Button variant={"default"} disabled={disableAddButton} onPress={() => addUnitPressed(true)}>
							<Text>{t("AddHalfVPs")}</Text>
						</Button>
					</View>
					<View style={{ flex: 1, margin: 4 }}>
						<Button disabled={disableAddButton} onPress={() => addUnitPressed(false)} variant={"confirm"}>
							<Text bold style={{ color: theme.black }}>
								{t("AddVPs")}
							</Text>
						</Button>
					</View>
				</View>
			</View>
		);
	}
);
export default UnitSelector;

const styles = StyleSheet.create({
	topContainer: {
		flex: 1,
	},
	bottomContainer: {
		flex: 1,
	},
	dropdown: { padding: 8, borderRadius: 16 },
	selectedStyle: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 14,
		backgroundColor: "white",
		shadowColor: "#000",
		marginTop: 8,
		marginRight: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	},
	textSelectedStyle: {
		marginRight: 5,
		fontSize: 12,
		color: "green",
	},
	selectedTextStyle: {
		fontSize: 14,
	},
});
