import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ModalContainer from "@components/ModalContainer";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import bretonnianList from "../../data/json/wmr/bretonnian.json";
import orkList from "../../data/json/wmr/orks.json";
import magicItemsList from "../../data/json/wmr/magic-items.json";
import { AntDesign } from "@expo/vector-icons";

import { Factions } from "@utils/constants";
import DropDownPicker from "react-native-dropdown-picker";
import { current } from "@reduxjs/toolkit";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "@hooks/useTheme";
import Button from "@components/button";

type VictoryPointsProps = {
	player: "playerONe" | "playerTwo";
};
export type DropDownItemProps = {
	label: string;
	value: string | number;
};
const VictoryPoints = ({ player }: VictoryPointsProps) => {
	const navigation = useNavigation();
	const { theme } = useTheme();
	const [factionList, setFactionList] = useState<any>();
	const [factionSelection, setFactionSelection] = useState<DropDownItemProps>();
	const [unitSelection, setUnitSelection] = useState<DropDownItemProps>();
	const [magicItemsSelections, setMagicItemsSelections] = useState<any[]>([]);

	const [currentUnit, setCurrentUnit] = useState(null);

	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
	const [ddUnits, setDdUnits] = useState<DropDownItemProps[]>([]);
	const [ddMagicItems, setDdMagicItems] = useState<DropDownItemProps[]>([]);

	// set faction based of session.faction
	const multiSelectRef = useRef(null);
	useEffect(() => {
		// get list of factions
		const factions = Object.keys(Factions);
		const dropdownList = factions.map(
			(x, index) => ({ label: x.replace("_", " "), value: index + 1 } as DropDownItemProps)
		);
		setDdFactions(dropdownList);
	}, []);

	useEffect(() => {
		let list: any[] = [];
		if (factionSelection) {
			switch (factionSelection.value) {
				case Factions.Bretonnians:
					list = bretonnianList.units;
					setFactionList(bretonnianList);
					// const array = Object.entries(bretonnianList.units);
					// set faction list
					break;

				default:
					break;
			}
			const test = list?.map((x) => ({
				label: `${x.name} - ${x.points}pts`,
				value: x.name ? x.name : "",
			}));
			setDdUnits(test);
		}

		// get all units for faction
	}, [factionSelection]);

	useEffect(() => {
		// get magic items for unit
		if (unitSelection && factionList) {
			console.log(unitSelection, "unitSelection");
			setCurrentUnit(factionList.units.find((x: any) => x.name == unitSelection.value));
		}
	}, [unitSelection]);

	useEffect(() => {
		if (currentUnit != undefined) {
			console.log("SETTING MAGIC ITEMS");
			const itemsArray: any[] = magicItemsList.upgrades;
			const factionUpgrades: any[] = factionList?.upgrades;
			const totalItems = itemsArray.concat(factionUpgrades);
			// set points value depending on the unit selected
			const allitems = totalItems.map((x) => ({
				label: `${x.name}`,
				value: x.name,
			}));
			setDdMagicItems(allitems);
			console.log(totalItems.length, "total items");
		}
	}, [currentUnit]);

	return (
		<ModalContainer onPageModalClosePressed={() => navigation.goBack()} headerTitle={"Victory Points"}>
			<View style={{ flex: 1, flexDirection: "column" }}>
				<View style={[styles.topContainer]}></View>
				<ScrollView style={[styles.bottomContainer]}>
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
									setFactionSelection(item);
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
								onChange={(item) => setUnitSelection(item)}
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
									setMagicItemsSelections(item);
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
				</ScrollView>
			</View>
		</ModalContainer>
	);
};

export default VictoryPoints;

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
