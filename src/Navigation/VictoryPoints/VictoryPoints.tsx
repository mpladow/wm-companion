import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ModalContainer from "@components/ModalContainer";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import bretonnianList from "../../data/json/wmr/bretonnian.json";
import orcList from "../../data/json/wmr/orks.json";
import tombKingsList from "../../data/json/wmr/tombKings.json";
import empireList from "../../data/json/wmr/empire.json";
import skavenList from "../../data/json/wmr/skaven.json";
import chaosList from "../../data/json/wmr/chaos.json";
import woodElvesList from "../../data/json/wmr/woodElves.json";
import vampireCountsList from "../../data/json/wmr/vampireCounts.json";
import beastmenList from "../../data/json/wmr/beastmen.json";
import cathayList from "../../data/json/wmr/cathay.json";
import nightGoblinsList from "../../data/json/wmr/nightGoblins.json";
import dwarvesList from "../../data/json/wmr/dwarves.json";
import darkElvesList from "../../data/json/wmr/darkelves.json";
import highElvesList from "../../data/json/wmr/highElves.json";
import daemonsList from "../../data/json/wmr/daemons.json";

import magicItemsList from "../../data/json/wmr/magic-items.json";

import playerTypes, { Factions } from "@utils/constants";
import { useTheme } from "@hooks/useTheme";
import { Button, Text, TextBlock } from "@components/index";
import UnitSelector from "./components/UnitSelector";
import Points from "./components/Points";
import { DropDownItemProps, PlayerDetailsProps } from "@navigation/Home/screens/Home";
import { useVictoryPoints, VPScoreProps } from "@context/VPContext";
import { AntDesign } from "@expo/vector-icons";

type VictoryPointsProps = {
	player: playerTypes;
};
type ItemCompact = {
	name: string;
	points: number;
	armour?: string;
	hits?: number;
};
const VictoryPoints = () => {
	const navigation = useNavigation();
	const { theme } = useTheme();
	// set faction based of session.faction
	const vpContext = useVictoryPoints();
	const [factionList, setFactionList] = useState<any>();
	const [allMagicItems, setAllMagicItems] = useState<any>();
	// the below three states are required to add a point
	const [factionSelection, setFactionSelection] = useState<number | undefined>(vpContext?.p1DefaultFaction);
	const [unitSelection, setUnitSelection] = useState<DropDownItemProps>();
	const [magicItemsSelections, setMagicItemsSelections] = useState<string[]>([]);

	const [unit, setUnit] = useState<ItemCompact>();
	const [magicItems, setMagicItems] = useState<ItemCompact[]>();

	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
	const [ddUnits, setDdUnits] = useState<DropDownItemProps[]>([]);
	const [ddMagicItems, setDdMagicItems] = useState<DropDownItemProps[]>([]);

	// on startup, if a selected faction exists, use this faction
	useEffect(() => {
		vpContext.selectedPlayer == "playerOne"
			? setFactionSelection(vpContext.p1DefaultFaction)
			: setFactionSelection(vpContext.p2DefaultFaction);
	}, []);

	const handleFactionSelection = (faction: number) => {
		// update default faction
		vpContext.selectedPlayer == "playerOne"
			? vpContext.updateFaction("playerOne", faction)
			: vpContext.updateFaction("playerTwo", faction);
		// update faction for this instance
		setFactionSelection(faction);
	};

	const multiSelectRef = useRef(null);
	useEffect(() => {
		// get list of factions
		const factions = Object.keys(Factions);

		let ddList = [];
		for (const [key, value] of Object.entries(Factions)) {
			ddList.push({ label: key.replace("_", " "), value: value } as DropDownItemProps);
		}
		ddList = ddList.sort((a, b) => {
			if (a.label < b.label) {
				return -1;
			}
			if (a.label > b.label) {
				return 1;
			}
			return 0;
		});
		setDdFactions(ddList);
	}, []);

	useEffect(() => {
		let list: any[] = [];
		console.log(factionSelection, "factionSelection");
		if (factionSelection) {
			switch (factionSelection) {
				case Factions.Bretonnians:
					list = bretonnianList.units;
					setFactionList(bretonnianList);
					break;
				case Factions.Orcs:
					list = orcList.units;
					setFactionList(orcList);
					break;
				case Factions.Tomb_Kings:
					list = tombKingsList.units;
					setFactionList(tombKingsList);
					break;
				case Factions.Empire:
					list = empireList.units;
					setFactionList(empireList);
					break;
				case Factions.Skaven:
					list = skavenList.units;
					setFactionList(skavenList);
					break;
				case Factions.Chaos:
					list = chaosList.units;
					setFactionList(chaosList);
					break;
				case Factions.Wood_Elves:
					list = woodElvesList.units;
					setFactionList(woodElvesList);
					break;
				case Factions.Vampire_Counts:
					list = vampireCountsList.units;
					setFactionList(vampireCountsList);
					break;
				case Factions.Beastmen:
					list = beastmenList.units;
					setFactionList(beastmenList);
					break;
				case Factions.Cathay:
					list = cathayList.units;
					setFactionList(cathayList);
					break;
				case Factions.Goblins:
					list = nightGoblinsList.units;
					setFactionList(nightGoblinsList);
					break;
				case Factions.Dwarves:
					list = dwarvesList.units;
					setFactionList(dwarvesList);
					break;
				case Factions.Dark_Elves:
					list = darkElvesList.units;
					setFactionList(darkElvesList);
					break;
				case Factions.High_Elves:
					list = highElvesList.units;
					setFactionList(highElvesList);
					break;
				case Factions.Daemons:
					list = daemonsList.units;
					setFactionList(daemonsList);
					break;
				default:
					break;
			}
			const test = list?.map((x) => ({
				label: `${x.name} - ${x.points}pts`,
				value: x.name ? x.name : "",
			}));
			console.log(test, "test");
			setDdUnits(test);
		}

		// get all units for faction
	}, [factionSelection]);

	useEffect(() => {
		// get magic items for unit
		if (unitSelection && factionList) {
			const _unit = factionList.units.find((x: any) => x.name == unitSelection.value);
			setUnit({ name: _unit.name, armour: _unit.armour, hits: _unit.hits, points: _unit.points });
		}
	}, [unitSelection]);

	useEffect(() => {
		if (unit != undefined) {
			const itemsArray: any[] = magicItemsList.upgrades;
			const factionUpgrades: any[] = factionList?.upgrades;
            console.log(factionUpgrades, 'Faction upgrades')
			let totalItems = [];
			if (!factionUpgrades == undefined || factionUpgrades.length > 0) {
                console.log(`faction upgrades added`)
				totalItems = itemsArray.concat(factionUpgrades);
			} else {
                console.log(`NO faction upgrades added`)

				totalItems = itemsArray;
			}
			setAllMagicItems(totalItems);
			// set points value depending on the unit selected
			const allitems = totalItems.map((x) => ({
				label: `${x.name}`,
				value: x.name,
			}));
			setDdMagicItems(allitems);
		}
	}, [unit]);

	useEffect(() => {
		// set objects from selections
		let selectedItems: ItemCompact[] = [];
		magicItemsSelections.forEach((selection) => {
			const magicItem = allMagicItems.find((x: any) => x.name == selection);

			// if variable points value then set this value
			//selectedItems.push(magicItem);
			const isVariable = typeof magicItem.points === "object";
			let points = "";
			if (isVariable) {
				// is variable, add this
				console.log("variable");
				let unitArmour = unit?.armour;
				if (unitArmour == null) unitArmour = "-";
				const unitHits = unit?.hits;
				let isVariableByHits = false;

				if (unitHits) {
					isVariableByHits = magicItem.points[unitHits.toString()] !== undefined;
					console.log(magicItem.points[unitHits.toString()], "key of magic item");
					if (isVariableByHits) points = magicItem.points[unitHits.toString()];
				}
				if (unitArmour && !isVariableByHits) {
					console.log(magicItem.points[unitArmour], "magic points armour");
					points = magicItem.points[unitArmour];
				}
			} else {
				points = magicItem.points;
			}
			const magicItemCompact: ItemCompact = { name: magicItem.name, points: parseInt(points) };
			selectedItems.push(magicItemCompact);
		});
		setMagicItems(selectedItems);
		console.log(selectedItems, "UPGRADES TO ADD");
	}, [magicItemsSelections]);

	const handleAddVPs = (points: number) => {
		//create a new VPScoreProps object
		let vpObject: VPScoreProps = {
			id: Math.random().toString(),
			sourceName: "Additional Points",
			sourcePoints: points,
			isUnit: false,
			isItem: false,
			isHalfPoints: false,
		};
		// add unit
		vpContext.addScore(vpObject);
	};
	const handleAddUnit = (isHalfPoints: boolean) => {
		//create a new VPScoreProps object
		let vpObject: VPScoreProps = {
			id: Math.random().toString(),
			sourceName: unit?.name ? unit?.name : "",
			sourcePoints: unit?.points ? unit.points : 0,
			isUnit: true,
			isItem: false,
			isHalfPoints: isHalfPoints,
		};
		// check if items exists
		if (magicItems) {
			const mappedItems = magicItems.map((x) => {
				return {
					id: Math.random().toString(),
					sourceName: x.name,
					sourcePoints: x.points,
					isUnit: false,
					isItem: true,
				};
			});
			vpObject.attachedItems = mappedItems;
		}
		// add unit
		setMagicItemsSelections([]);
		vpContext.addScore(vpObject);
	};
	const [bottomSection, setBottomSection] = useState<"units" | "vps">("units");

	return (
		<ModalContainer
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={`Victory Points: ${
				vpContext.selectedPlayer == "playerOne" ? vpContext.getP1TotalPoints : vpContext.getP2TotalPoints
			}`}
		>
			<View style={{ flex: 1, flexDirection: "column" }}>
				<View style={[styles.topContainer]}>
					<FlatList
						data={vpContext.selectedPlayer == "playerOne" ? vpContext.p1VpScore : vpContext.p2VpScore}
						renderItem={({ item, index }) => {
							const unitScore = item.isHalfPoints ? Math.round(item.sourcePoints / 2) : item.sourcePoints;
							let unitUpgrades = item.attachedItems?.map((x) => x.sourcePoints);
							const unitUpgradesScore = unitUpgrades
								? unitUpgrades.reduce((current, a) => current + a, 0)
								: 0;
							const unitTotalScore = unitScore + unitUpgradesScore;
							return (
								<View
                                key={`unit$_{index}`}
									style={[
										styles.listItem,
										{
											backgroundColor: theme.backgroundVariant,
											flex: 1,
											justifyContent: "space-between",
											flexDirection: "row",
											alignItems: "center",
										},
									]}
								>
									<View style={{ flex: 2, flexDirection: "column" }}>
										<Text italic={item.isHalfPoints ? true : false}>
											{item.sourceName} - {unitScore}pts
										</Text>
										{item.attachedItems?.map((item, index) => {
											return (
												<View key={`upgrade_${index}`}
													style={{
														justifyContent: "center",
														alignItems: "center",
														borderRadius: 16,
														backgroundColor: theme.backgroundVariant2,
														padding: 4,
													}}
												>
													<Text style={{ fontSize: 12 }}>
														{item.sourceName} - {item.sourcePoints}pts
													</Text>
												</View>
											);
										})}
									</View>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "flex-end",
										}}
									>
										<View>
											{item.sourceName != "Additional Points" ? (
												<Button
													onPress={() => vpContext.toggleHalfPoints(item.id)}
													variant={"default"}
												>
													<Text italic={item.isHalfPoints}>{unitTotalScore}</Text>
												</Button>
											) : null}
										</View>
										<View style={{ marginLeft: 12 }}>
											<Button onPress={() => vpContext.removeScore(item.id)} variant={"danger"}>
												<AntDesign name='delete' size={18} color={theme.text} />
											</Button>
										</View>
									</View>
								</View>
							);
						}}
					/>
				</View>
				<ScrollView style={[styles.bottomContainer]}>
					<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
						<View style={{ flex: 1, alignItems: "center" }}>
							<TouchableOpacity onPress={() => setBottomSection("units")}>
								<Text style={bottomSection == "units" && { color: theme.accent }}>Units</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, alignItems: "center" }}>
							<TouchableOpacity onPress={() => setBottomSection("vps")}>
								<Text style={bottomSection == "vps" && { color: theme.accent }}>Additional</Text>
							</TouchableOpacity>
						</View>
					</View>
					{bottomSection == "units" ? (
						<UnitSelector
							ddFactions={ddFactions}
							ddUnits={ddUnits}
							ddMagicItems={ddMagicItems}
							factionSelection={factionSelection}
							unitSelection={unitSelection}
							magicItemsSelections={magicItemsSelections}
							handleSetFactionSelection={handleFactionSelection}
							handleSetUnitSelection={setUnitSelection}
							handleSetMagicItemsSelection={setMagicItemsSelections}
							multiSelectRef={multiSelectRef}
							addUnitPressed={handleAddUnit}
						/>
					) : (
						<Points onAddVPPressed={handleAddVPs} />
					)}
				</ScrollView>
			</View>
		</ModalContainer>
	);
};

export default VictoryPoints;

const styles = StyleSheet.create({
	topContainer: {
		flex: 0.8,
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
	listItem: {
		padding: 8,
		marginBottom: 4,
	},
});
