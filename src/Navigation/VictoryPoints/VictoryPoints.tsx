import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ModalContainer from "@components/ModalContainer";
import { useNavigation } from "@react-navigation/native";
import magicItemsList from "../../data/json/wmr/magic-items.json";

import playerTypes, { Factions } from "@utils/constants";
import { useTheme } from "@hooks/useTheme";
import { Button, Text, TextBlock } from "@components/index";
import UnitSelector from "./components/UnitSelector";
import Points from "./components/Points";
import { DropDownItemProps, PlayerDetailsProps } from "@navigation/Tracker/screens/Tracker";
import { useVictoryPoints, VPScoreProps } from "@context/VPContext";
import { AntDesign } from "@expo/vector-icons";
import { getFactions, getFactionUnits } from "@utils/factionHelpers";
import uuid from "uuid-random";
import { useSettingsContext } from "@context/SettingsContext";
import { useTranslation } from "react-i18next";

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
	const { settings } = useSettingsContext();
	const {t} = useTranslation(["tracker", "common"])
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
		const { ddFactionList } = getFactions();
		setDdFactions(ddFactionList);
	}, []);

	useEffect(() => {
		console.log(factionSelection, "factionSelection");
		if (factionSelection) {
			const { factionList, ddFactionUnits } = getFactionUnits(factionSelection);
			setFactionList(factionList);
			setDdUnits(ddFactionUnits);
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
			console.log(factionUpgrades, "Faction upgrades");
			let totalItems = [];
			if (!factionUpgrades == undefined || factionUpgrades.length > 0) {
				console.log(`faction upgrades added`);
				totalItems = itemsArray.concat(factionUpgrades);
			} else {
				console.log(`NO faction upgrades added`);

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
			id: uuid(),
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
			id: uuid(),
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
					id: uuid(),
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

	const calculateTotalUnits = () => {
		const currentScore = vpContext.selectedPlayer == "playerOne" ? vpContext.p1VpScore : vpContext.p2VpScore;
		const countFull = currentScore.filter((x) => x.isUnit).filter((x) => !x.isHalfPoints).length;
		const halfUnits = currentScore.filter((x) => x.isUnit).filter((x) => x.isHalfPoints).length;
		const countHalf = halfUnits / 2;

		console.log(countHalf, "half");

		return countFull + countHalf;
	};
	return (
		<ModalContainer
			rotateContainer={vpContext.selectedPlayer == "playerTwo" && !settings.trackerTwoPlayerMode}
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={`${t("VPs")}: ${
				vpContext.selectedPlayer == "playerOne" ? vpContext.getP1TotalPoints : vpContext.getP2TotalPoints
			}`}
		>
			<View style={{ flex: 0.9, flexDirection: "column" }}>
				<View style={[styles.topContainer]}>
					<View style={{ paddingBottom: 12, alignItems: "center" }}>
						{calculateTotalUnits() > 0 ? (
							<Text style={{ color: theme.danger, fontSize: 20 }} variant={"heading3"}>
								{t("EnemyUnitsDefeated")}: {`${calculateTotalUnits()}`}
							</Text>
						) : null}
					</View>
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
												<View
													key={`upgrade_${index}`}
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
													variant={"secondary"}
													style={{
														opacity: item.isHalfPoints ? 0.5 : 1,
													}}
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
				<View style={[styles.bottomContainer]}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
						<View style={{ flex: 1, alignItems: "center" }}>
							<TouchableOpacity onPress={() => setBottomSection("units")}>
								<Text style={bottomSection == "units" && { color: theme.accent }}>Units</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, alignItems: "center" }}>
							<TouchableOpacity onPress={() => setBottomSection("vps")}>
								<Text style={bottomSection == "vps" && { color: theme.accent }}>{t("Additional", {ns: "common"})}</Text>
							</TouchableOpacity>
						</View>
					</View>
					{bottomSection == "units" ? (
						<UnitSelector
							useOnePlayer={
								vpContext.selectedPlayer == "playerTwo" ? settings.trackerTwoPlayerMode : true
							}
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
				</View>
			</View>
		</ModalContainer>
	);
};

export default VictoryPoints;

const styles = StyleSheet.create({
	topContainer: {
		flex: 1.3,
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
