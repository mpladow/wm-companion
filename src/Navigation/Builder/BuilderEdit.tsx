import {
	Animated,
	Dimensions,
	FlatList,
	Modal,
	SafeAreaView,
	SectionList,
	SectionListData,
	StyleSheet,
	Touchable,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BuilderContextProvider, SelectedUnitProps, useBuilderContext } from "@context/BuilderContext";
import { useTheme } from "@hooks/useTheme";
import { Button, CustomCheckbox, Text, TextBlock } from "@components/index";
import { getFactionUnits, getGenericSpecialRules, getKeyByValue } from "@utils/factionHelpers";
import CustomModal from "@components/CustomModal";
import { FactionListProps, UnitProps, UpgradesProps } from "@utils/types";
import UnitCard from "./components/UnitCard";
import { Entypo } from "@expo/vector-icons";
import UnitDetailsCard from "./components/UnitDetailsCard";
import SpecialRulesCollapsible from "./components/SpecialRulesCollapsible";
import magicItemsList from "../../data/json/wmr/magic-items.json";
import UpgradeCard from "./components/UpgradeCard";
import { Factions } from "@utils/constants";
import SpellBookModal from "./components/SpellBookModal";
import UnitPreview from "./components/UnitPreview";
import UpgradePreview from "./components/UpgradePreview";
import ArmyPointsCount from "./components/ArmyPointsCount";
import { LinearGradient } from "expo-linear-gradient";
import AllSelectedUpgradesModal from "./components/Modals/AllSelectedUpgradesModal";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { getUpgradeDetailsByName } from "./utils/builderHelpers";

export type sectionListDataProps = {
	title: string;
	data: SelectedUnitProps[];
};
const BuilderEdit = () => {
	const builder = useBuilderContext();
	const navigation = useNavigation();
	const { theme } = useTheme();
	//modals
	const [modalVisible, setModalVisible] = useState(false);
	const [magicItemModalVisible, setMagicItemModalVisible] = useState(false);
	const [errorsVisible, setErrorsVisible] = useState(false);
	const [spellsVisible, setSpellsVisible] = useState(false);
	const [unitPreviewVisible, setUnitPreviewVisible] = useState(false);
	const [upgradePreviewVisible, setUpgradePreviewVisible] = useState(false);
	const [allSelectedUpgradesVisible, setAllSelectedUpgradesVisible] = useState(false);

	// show statline
	const [showStatline, setShowStatline] = useState(false);

	const [magicItems, setMagicItems] = useState<UpgradesProps[]>([]);
	const [currentPoints, setCurrentPoints] = useState(0);
	const [totalPoints, setTotalPoints] = useState(1000); // this state will update itself as the current points exceeds the previous value
	const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
	const [showFactionInfo, setShowFactionInfo] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<string>("");
	const [selectedUnitDetails, setSelectedUnitDetails] = useState<UnitProps>();
	const [currentUpgradeDetails, setCurrentUpgradeDetails] = useState<UpgradesProps | undefined>();

	const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);
	const [addingUnits, setAddingUnits] = useState(false);

	useEffect(() => {
		// get all units for selected army list
		if (builder.selectedArmyList) {
			navigation.setOptions({
				headerRight: () => (
					<Menu>
						<MenuTrigger>
							<Entypo name='dots-three-vertical' size={20} color={theme.text} />
						</MenuTrigger>
						<MenuOptions>
							<MenuOption onSelect={() => navigation.navigate("BuilderQuickView")}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<View style={{ flex: 1 }}>
										<Entypo name='export' size={20} color='black' />
									</View>
									<View style={{ flex: 5, padding: 4, paddingVertical: 8 }}>
										<Text style={{ color: theme.black }}>Export List</Text>
									</View>
									<View style={{ paddingRight: 8 }}>
										<Entypo name='warning' size={20} color={theme.warning} />
									</View>
								</View>
							</MenuOption>
						</MenuOptions>
					</Menu>
				),
				headerTitle: (props: any) => (
					<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
						<View style={{ width: 250 }}>
							<Text
								numberOfLines={1}
								variant='heading3'
								style={{
									fontSize: 20,
								}}
							>
								{builder.selectedArmyList?.name}
							</Text>
							<Text>
								{builder.selectedArmyList?.name &&
									getKeyByValue(Factions, builder.selectedArmyList.faction)?.replaceAll("_", " ")}
							</Text>
						</View>
					</View>
				),
			});

			const factionListData = getFactionUnits(builder.selectedArmyList?.faction);
			setFactionUnits(factionListData?.factionList?.units);
		}
	}, [builder.selectedArmyList]);

	useEffect(() => {
		const _currentPoints = builder.calculateCurrentArmyPoints();
		if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000) setTotalPoints(2000);
		if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000) setTotalPoints(3000);
		if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
		if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
		if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
	}, [builder.calculateCurrentArmyPoints()]);

	const handleAddUnitPress = (openUnits: boolean) => {
		setAddingUnits(openUnits);
		setModalVisible(true);
	};

	const handleAddUnitToArmyPress = (
		unitName: string,
		points: number | undefined,
		isLeader: boolean,
		maxCount?: number,
		minCount?: number,
		ignoreBreakPoint?: boolean
	) => {
		builder.addUnit(unitName, points, isLeader, maxCount, minCount, ignoreBreakPoint);
	};
	const handleAddUpgradeToUnitPress = (
		unitName: string,
		type: string,
		points: number,
		upgradeName: string,
		maxCount?: number,
		armyLimitMaxCount?: number,
		addOnUpgrades?: string[]
	) => {
		builder.addItem(unitName, type, points, upgradeName, maxCount, armyLimitMaxCount, addOnUpgrades);
	};
	const handleRemoveUpgrade = (unitName: string, id: string) => {
		console.log(`handleRemoveUpgrade:: removing ${id} from ${unitName} `);
		builder.removeItem(unitName, id);
	};
	useEffect(() => {
		if (factionUnits && builder.selectedArmyList) {
			// update total points
			let pointsCount = 0;
			builder.selectedArmyList?.selectedUnits.forEach((unit) => {
				const currentUnit = factionUnits.find((x) => x.name == unit.unitName);
				if (currentUnit?.points) pointsCount += currentUnit.points;
				// if attached unit has items, calculate value for that too
			});
			setCurrentPoints(pointsCount);
		}
	}, [factionUnits, builder.selectedArmyList]);

	useEffect(() => {
		console.log("updated army list");
		if (builder?.selectedArmyList) {
			// set leaders
			const _leaders = builder?.selectedArmyList?.selectedUnits
				.filter((x) => x.isLeader)
				.sort((a, b) => (a.order > b.order ? 1 : -1));
			const _frontLineUnits = builder?.selectedArmyList?.selectedUnits
				?.filter((x) => !x.isLeader)
				.sort((a, b) => (a.order > b.order ? 1 : -1));

			// set frontline
			const _sectionListData: sectionListDataProps[] = [
				{ title: "Leaders", data: _leaders },
				{ title: "Units", data: _frontLineUnits },
			];

			setSectionListData(_sectionListData);
		}
	}, [builder?.selectedArmyList, builder?.selectedArmyList?.selectedUnits]);

	const handleRemoveUnit = (unitId: string, unitPoints: number) => {
		builder.removeUnit(unitId, unitPoints);
	};

	const handleOnUnitCardPress = (unitName: string) => {
		console.log(unitName, "UNIT NAME");
		const rawUnitData = factionUnits?.find((x) => x.name == unitName);
		let _unit = Object.assign({}, rawUnitData);
		_unit.specialRules = [];
		if (_unit) {
			if (builder.factionDetails?.specialRules && _unit?.name) {
				//@ts-ignore - TODO: need to check typing
				const _specialRulesForUnit = builder.factionDetails?.specialRules[unitName];
				const _allGenericSpecialRules = getGenericSpecialRules();
				//@ts-ignore
				const _genericSpecialRulesExist = _allGenericSpecialRules[unitName];
				if (_specialRulesForUnit) {
					console.log("handleOnUnitCardPress:: special rule for UNIT NAME");
					if (_specialRulesForUnit.text) _unit.specialRules.push(_specialRulesForUnit);
					// setSpecialRules(_specialRules);
				}
				if (_genericSpecialRulesExist != undefined) {
					console.log("handleOnUnitCardPress:: generic special rule found");
					_unit.specialRules.push(_genericSpecialRulesExist);
				}
				console.log(rawUnitData?.specialRules, "special rules found");
				if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
					console.log("handleOnUnitCardPress:: special rule for UNIT UPGRADE");

					rawUnitData.specialRules?.map((x) => {
						if (builder.factionDetails?.specialRules) {
							const specialRule = builder.factionDetails?.specialRules[x];
							_unit.specialRules?.push(specialRule);
						}
						const genericSpecialRuleFound = _allGenericSpecialRules[x];
						if (genericSpecialRuleFound) {
							_unit.specialRules?.push(genericSpecialRuleFound);
						}
					});
				}
			}

			setSelectedUnitDetails(_unit);
			setUnitPreviewVisible(true);
		} else {
			console.error(`UNIT NOT FOUND for ${unitName}`);
		}
	};
	const getUnitDetailsByUnitName = (unitName: string) => {
		const rawUnitData = factionUnits?.find((x) => x.name == unitName);
		let _unit = Object.assign({}, rawUnitData);

		if (_unit) {
			if (builder.factionDetails?.specialRules && _unit?.name) {
				//@ts-ignore - TODO: need to check typing
				const _specialRules = builder.factionDetails?.specialRules[unitName];
				const _allGenericSpecialRules = getGenericSpecialRules();
				//@ts-ignore
				const _genericSpecialRulesExist = _allGenericSpecialRules[_unit.name];

				let _unitAdditionalDate = Object.assign({}, _unit);
				_unitAdditionalDate["specialRulesExpanded"] = [];
				if (_specialRules?.text != undefined) {
					_unitAdditionalDate["specialRulesExpanded"]?.push(_specialRules);
				}
				if (_genericSpecialRulesExist != undefined) {
					_unitAdditionalDate["specialRulesExpanded"]?.push(_genericSpecialRulesExist);
				}
				if (rawUnitData?.specialRules && rawUnitData.specialRules?.length > 0) {
					rawUnitData.specialRules?.map((x) => {
						if (builder.factionDetails?.specialRules) {
							const specialRule = builder.factionDetails?.specialRules[x];
							_unitAdditionalDate["specialRulesExpanded"].push(specialRule);
						}
					});
				}

				return _unitAdditionalDate;
			}
		} else {
			console.error(`UNIT NOT FOUND for ${unitName}`);
		}
	};
	const handleOnUpgradePress = (upgradeName: string) => {
		if (builder.factionDetails) {
			const _upgrades = getUpgradeDetailsByName(upgradeName, builder.factionDetails);
			// let _upgrades: UpgradesProps | undefined = magicItemsList.upgrades.find((x) => x.name == upgradeName);
			// if (!_upgrades?.text) {
			// 	_upgrades = builder.factionDetails?.upgrades?.find((x) => x.name == upgradeName);
			if (_upgrades && _upgrades?.text == null) {
				// find upgrade text fromm special rules
				const specialRules = builder.factionDetails?.specialRules[upgradeName];
				if (specialRules) {
					_upgrades.text = specialRules.text;
				}
			}
			// }
			if (_upgrades) {
				console.log("upgrade found");
				setCurrentUpgradeDetails(_upgrades);
				setUpgradePreviewVisible(true);
			} else {
				console.error("upgrade not found");
			}
		}
	};
	// **ADD MAGICITEMS
	// TODO: COMPRESS THIS FUNCTION AS THIS NEEDS REFACTORING
	const handleAddMagicItemPress = (unitName: string, unitType: string) => {
		// get all magic items
		setSelectedUnit(unitName);
		const selectedUnit = builder.selectedArmyList?.selectedUnits.find((x) => x.unitName == unitName);
		// TODO: extract all this into a seperate use effect.
		const itemsArray: any = magicItemsList.upgrades;
		const magicItemConstraints = magicItemsList.upgradeConstraints;
		// faction unit types can override the above constraints

		const factionUpgrades = builder.factionDetails?.upgrades;
		factionUpgrades?.map((x) => {
			if (builder.factionDetails?.specialRules) {
				const upgradeText = builder.factionDetails?.specialRules[x.name]?.text;
				if (upgradeText) {
					x.text = upgradeText;
				}
			}
		});

		const unitDetails = factionUnits?.find((x) => x.name == unitName);

		const upgradesForUnitStrings = unitDetails?.upgrades;
		let specificUpgradesForUnitArr: any[] = [];
		// filter faction upgrades to only upgrades specific to this unit
		upgradesForUnitStrings &&
			upgradesForUnitStrings.map((upgrade) => {
				const _upgradeFound = factionUpgrades?.find((x) => x.name == upgrade);
				_upgradeFound && specificUpgradesForUnitArr.push(_upgradeFound);
			});

		//if given the upgrade of wizard, all the user to have wizard items
		let permittedUpgrades: any[] = [];
		const unitHasWizardUpgrade = selectedUnit?.attachedItems.find(
			(x) => x.addOnUpgrades && x.addOnUpgrades?.length > 0
		);
		if (unitHasWizardUpgrade) {
			permittedUpgrades = magicItemConstraints.map((ui) => {
				const upgradePermitted = ui.unitType.some((x) => x.includes(unitType));
				if (upgradePermitted) {
					return ui.upgrades;
				} else {
					return;
				}
			});
			unitHasWizardUpgrade?.addOnUpgrades?.map((y) => {
				const upgradeToAdd = magicItemsList.upgrades.find((x) => x.name == y);
				if (upgradeToAdd) {
					permittedUpgrades.push(upgradeToAdd.name);
				}
				// add usualy upgrades
			});
			// permittedUpgrades = magicItemConstraints.map((ui) => {
			// 	const upgradePermitted = ui.unitType.some((x) => x.includes(unitType) || x.includes("Wizard"));
			// 	if (upgradePermitted) {
			// 		return ui.upgrades;
			// 	} else {
			// 		return;
			// 	}
			// });
		} else {
			permittedUpgrades = magicItemConstraints.map((ui) => {
				const upgradePermitted = ui.unitType.some((x) => x.includes(unitType));
				if (upgradePermitted) {
					return ui.upgrades;
				} else {
					return;
				}
			});
		}

		let flattedPermittedUpgrades = permittedUpgrades.flat(2);
		flattedPermittedUpgrades.forEach((x) => {
			const genericUpgrade = itemsArray.find((y) => y.name == x);
			genericUpgrade && specificUpgradesForUnitArr.push(genericUpgrade);
		});
		// to here
		// find upgrades from this permittedUpgrades list

		let upgadesToRemove: string[] = [];
		// console.log(specificUpgradesForUnitArr, "specific upgrades");
		specificUpgradesForUnitArr.forEach((up) => {
			const unitHasArmour = unitDetails?.armour ? unitDetails?.armour : "-";
			const unitHits = unitDetails?.hits ? unitDetails?.hits : null;

			let pointsCost;
			if (up.points == undefined) {
				console.error(up.name, "UPGRAADE WITH UNDEFINED");
			}
			if (up.name == "Banner of Shielding") {
				pointsCost = up.points[unitHasArmour];
				if (pointsCost) up.points = pointsCost;
			}
			if (up.name == "Banner of Steadfastness") {
				if (unitHasArmour !== "0" && unitHasArmour !== "-") {
					pointsCost = up.points[unitHasArmour];

					if (pointsCost !== undefined) {
						up.points = pointsCost;
					} else {
						console.log(up.points, "up.points");
					}
				} else {
					upgadesToRemove.push(up.name);
				}
			}
			if (up.name == "Banner of Fortitude") {
				if (unitHits) {
					pointsCost = up.points[unitHits];
				}
			}

			if (pointsCost) {
				up.points = pointsCost;
			}
		});
		// check unit upgrades and add additional items to generic magic items
		if (unitDetails?.upgrades?.length > 0) {
			unitDetails?.upgrades?.map((unitUpgrade) => {
				const magicItemToAdd = itemsArray.find((u) => u.name == unitUpgrade);
				const upgradeAlreadyExists = specificUpgradesForUnitArr.find((exUp) => exUp.name == unitUpgrade);
				if (!upgradeAlreadyExists) specificUpgradesForUnitArr.push(magicItemToAdd);
			});
		}
		specificUpgradesForUnitArr = specificUpgradesForUnitArr.filter((x) => {
			return !upgadesToRemove.includes(x.name);
		});

		setMagicItems(specificUpgradesForUnitArr);
		setMagicItemModalVisible(true);
	};
	const armyCount = useMemo(() => {
		return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
	}, [builder.calculateCurrentArmyPoints(), totalPoints]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			{/* list all units */}
			{builder.factionDetails?.armyRules ? (
				<SpecialRulesCollapsible
					toggleVisible={() => setShowFactionInfo(!showFactionInfo)}
					visible={!showFactionInfo}
					title={"Army Special Rules"}
					contents={builder.factionDetails.armyRules}
				/>
			) : null}
			{/* Spell list, break point */}
			<LinearGradient
				colors={["rgba(31,46,39, 0.4)", "rgba(6,9,7, 0.9)"]}
				start={{ y: 0, x: 0.5 }}
				end={{ y: 0.5, x: 0 }}
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: -0,
					height: Dimensions.get("screen").height,
					zIndex: 9,
				}}
			></LinearGradient>
			<View
				style={{
					zIndex: 9,
					justifyContent: "space-between",
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 12,
					paddingVertical: 8,
				}}
			>
				<View>
					<Text style={{ fontSize: 16 }}>{builder.getUnitCounts()}</Text>
				</View>
				<CustomCheckbox
					onValueChange={(val) => setShowStatline(val)}
					value={showStatline}
					label={"Show Statline"}
				/>
				<View>
					{builder.factionDetails?.name !== "Dwarfs" && builder.factionDetails?.name !== "Nippon" ? (
						<Button onPress={() => setSpellsVisible(!spellsVisible)} variant={"default"}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ marginRight: 8 }}>
									<Entypo name='open-book' size={20} color={theme.white} />
								</View>
								<Text bold>Spells</Text>
							</View>
						</Button>
					) : null}
				</View>
			</View>
			<SectionList
				style={{ zIndex: 9 }}
				ListFooterComponent={() => <View style={{ padding: 40 }}></View>}
				sections={sectionListData}
				renderSectionHeader={({ section: { title } }) => (
					<View
						style={{
							alignItems: "center",
							padding: 12,
							backgroundColor: theme.backgroundVariant2,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text variant='heading3' style={{ fontSize: 20, textTransform: "uppercase" }}>
							{title}
						</Text>
						{/* //TODO: Extract into seperate button */}
						<TouchableOpacity onPress={() => handleAddUnitPress(title != "Leaders")}>
							<View style={{ backgroundColor: theme.accent, borderRadius: 4, padding: 4 }}>
								<Entypo name='plus' size={24} color='black' />
							</View>
						</TouchableOpacity>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: "black" }}></View>}
				renderItem={({ item, index }) => {
					// get total unit count
					const unitDetails = factionUnits?.find((x) => x.name == item.unitName);
					if (unitDetails) {
						return (
							<>
								<UnitDetailsCard
									key={`unitDetails_${item.id}`}
									existingUnits={item.currentCount}
									unit={unitDetails}
									unitUpgrades={item.attachedItems}
									onShowUnitDetails={() => console.log("showUnitDetails")}
									onAddUnit={handleAddUnitToArmyPress}
									onDeleteUnit={() => handleRemoveUnit(item.id, unitDetails.points)}
									onAddUpgrade={() => handleAddMagicItemPress(item.unitName, unitDetails.type)}
									onRemoveUpgrade={handleRemoveUpgrade}
									onUnitCardPress={handleOnUnitCardPress}
									onUpgradePress={handleOnUpgradePress}
									currentArmyCount={builder.calculateCurrentArmyPoints()}
									hasError={builder.armyErrors.findIndex((x) => x.sourceName == item.unitName) > -1}
									unitDetailsExpanded={getUnitDetailsByUnitName(item.unitName)}
									showStatline={showStatline}
								/>
							</>
						);
					} else {
						return <Text>NOT FOUND</Text>;
					}
				}}
			/>
			{/* // points verification container */}
			<View style={{ zIndex: 9, position: "absolute", bottom: 10, left: 20, flexDirection: "row" }}>
				{/* TODO extract out  */}
				<ArmyPointsCount
					armyErrorsCount={builder.armyErrors.length}
					setVisibility={(visibility) => setErrorsVisible(visibility)}
					armyCount={armyCount}
				/>
			</View>
			<View style={{ position: "absolute", bottom: 10, right: 20, flexDirection: "row" }}>
				{/* TODO extract out  */}
			</View>
			{/* {All selected upgrades modal} */}
			<AllSelectedUpgradesModal
				setVisible={(vis) => setAllSelectedUpgradesVisible(vis)}
				visible={allSelectedUpgradesVisible}
				headerTitle={"Selected Upgrades"}
				upgrades={magicItems}
				selectedUpgrades={builder.selectedArmyList?.selectedUpgrades}
			/>
			{/* // add units/magic item modal */}
			<CustomModal
				setModalVisible={() => {
					setMagicItemModalVisible(!magicItemModalVisible);
				}}
				modalVisible={magicItemModalVisible}
				headerTitle={"Select Upgrades"}
			>
				<View>
					<FlatList
						data={magicItems}
						renderItem={(nestedItem) => {
							const itemStatusInArmy = builder.selectedArmyList?.selectedUpgrades.filter(
								(x) => x.upgradeName == nestedItem.item.name
							);
							return (
								<UpgradeCard
									key={nestedItem.index}
									targetUnitName={selectedUnit}
									upgrade={nestedItem.item}
									onAddUpgradePress={handleAddUpgradeToUnitPress}
									currentCount={itemStatusInArmy ? itemStatusInArmy.length : 0}
								/>
							);
						}}
					/>
				</View>
			</CustomModal>
			{/* // add new new */}
			<CustomModal
				setModalVisible={() => {
					setModalVisible(!modalVisible);
				}}
				modalVisible={modalVisible}
				headerTitle={"Select Units"}
				footerLeft={
					<ArmyPointsCount
						armyErrorsCount={builder.armyErrors.length}
						setVisibility={(visibility) => setErrorsVisible(visibility)}
						armyCount={armyCount}
						disableButton={true}
					/>
				}
			>
				<View>
					<FlatList
						data={
							addingUnits
								? factionUnits?.filter((x) => !x.command && x.command != 0)
								: factionUnits?.filter((x) => x.command || x.command == 0)
						}
						renderItem={({ item, index }) => {
							const units = addingUnits
								? sectionListData?.find((x) => x.title == "Units")?.data
								: sectionListData?.find((x) => x.title == "Leaders")?.data;
							const _unit = units?.filter((x) => x.unitName == item.name)[0];
							const unitCount = _unit ? _unit.currentCount : 0;
							return (
								<UnitCard
									key={index.toString()}
									unit={item}
									onAddUnitPress={handleAddUnitToArmyPress}
									currentCount={unitCount}
									onUnitCardPress={handleOnUnitCardPress}
									currentArmyCount={builder.calculateCurrentArmyPoints()}
								/>
							);
						}}
					/>
				</View>
			</CustomModal>
			<UpgradePreview
				handleSetVisible={(visibility) => setUpgradePreviewVisible(visibility)}
				visible={upgradePreviewVisible}
				selectedUpgradeDetails={currentUpgradeDetails}
			/>
			{selectedUnitDetails ? (
				<UnitPreview
					handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
					visible={unitPreviewVisible}
					selectedUnitDetails={selectedUnitDetails}
				/>
			) : null}
			{builder.factionDetails?.spells ? (
				<SpellBookModal
					handleSetVisible={(visibility) => setSpellsVisible(visibility)}
					visible={spellsVisible}
					spells={builder.factionDetails?.spells}
				/>
			) : null}
			<Modal animationType='fade' visible={errorsVisible} transparent={true}>
				<View style={styles.modalOverlay} onTouchStart={() => setErrorsVisible(!errorsVisible)}>
					<View
						style={{
							marginTop: 500,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.text,
							padding: 16,
							margin: 12,
							borderRadius: 20,
						}}
					>
						<FlatList
							data={builder.armyErrors}
							renderItem={(nestedItem) => {
								return (
									<View>
										<Text style={{ color: theme.black }}>{nestedItem.item.error}</Text>
									</View>
								);
							}}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default BuilderEdit;

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		//backgroundColor: 'blue',
		backgroundColor: "rgba(0,0,0,0.1)",
	},
});
