import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef } from "react";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Button from "@components/button";
import { DropDownItemProps } from "../VictoryPoints";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";

type UnitSelectorProps = {
	ddFactions: DropDownItemProps[];
	ddUnits: DropDownItemProps[];
	ddMagicItems: DropDownItemProps[];
	factionSelection: DropDownItemProps;
	unitSelection: DropDownItemProps;
	magicItemsSelections: any[];
	handleSetFactionSelection: (item: any) => void;
	handleSetUnitSelection: (item: any) => void;
	handleSetMagicItemsSelection: (item: any) => void;
	multiSelectRef: any;
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
	}: UnitSelectorProps) => {
		const { theme } = useTheme();
		return (
			<View>
				<View style={{ marginBottom: 4 }}>
					<Dropdown
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						placeholder='Select Faction'
						placeholderStyle={{ color: "#ddd" }}
						data={ddFactions}
						labelField='label'
						valueField='value'
						onChange={(item) => {
							handleSetFactionSelection(item);
						}}
						value={factionSelection}
					/>
				</View>
				<View style={{ marginBottom: 4 }}>
					<Dropdown
						placeholder='Select a Unit'
						placeholderStyle={{ color: "#ddd" }}
						disable={factionSelection == undefined}
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						data={ddUnits}
						labelField='label'
						valueField='value'
						onChange={(item) => handleSetUnitSelection(item)}
						value={unitSelection}
					/>
				</View>
				<View style={{ marginBottom: 4 }}>
					<MultiSelect
						ref={multiSelectRef}
						placeholder='Select Magic Items (Optional)'
						placeholderStyle={{ color: "#ddd" }}
						selectedTextStyle={styles.selectedTextStyle}
						selectedStyle={{ backgroundColor: "blue" }}
						search
						searchPlaceholder='Search...'
						style={[styles.dropdown, { backgroundColor: theme.white }]}
						data={ddMagicItems}
						labelField='label'
						valueField='value'
						disable={unitSelection == null}
						onChange={(item) => {
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
				<View style={{ marginTop: 16 }}>
					<Button onPress={() => console.log("done")} variant={"default"}>
						<Text>Add To Score</Text>
					</Button>
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
	},
	selectedTextStyle: {
		fontSize: 14,
	},
});
