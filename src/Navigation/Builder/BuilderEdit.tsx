import {
	Animated,
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
import { Button, Text, TextBlock } from "@components/index";
import { getFactionUnits, getKeyByValue } from "@utils/factionHelpers";
import CustomModal from "@components/CustomModal";
import { FactionListProps, UnitProps, UpgradesProps } from "@utils/types";
import UnitCard from "./components/UnitCard";
import { Entypo } from "@expo/vector-icons";
import UnitDetailsCard from "./components/UnitDetailsCard";
import SpecialRulesCollapsible from "./components/SpecialRulesCollapsible";
import { getGroupedList, groupByKey } from "./utils/builderHelpers";
import magicItemsList from "../../data/json/wmr/magic-items.json";
import UpgradeCard from "./components/UpgradeCard";
import { Factions } from "@utils/constants";
import SpellBookModal from "./components/SpellBookModal";
import UnitPreview from "./components/UnitPreview";
import UpgradePreview from "./components/UpgradePreview";
import ArmyPointsCount from "./components/ArmyPointsCount";

type sectionListDataProps = {
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
	const [magicItems, setMagicItems] = useState<UpgradesProps[]>([]);
	const [currentPoints, setCurrentPoints] = useState(0);
	const [totalPoints, setTotalPoints] = useState(1000); // this state will update itself as the current points exceeds the previous value
	const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
	const [showFactionInfo, setShowFactionInfo] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<string>("");
	const [selectedUnitDetails, setSelectedUnitDetails] = useState<UnitProps>();

	const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);
	const [addingUnits, setAddingUnits] = useState(false);

	useEffect(() => {
		// get all units for selected army list
		if (builder.selectedArmyList) {
			navigation.setOptions({
				headerTitle: (props: any) => (
					<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
						<View>
							<Text
								variant='heading3'
								style={{
									fontSize: 24,
								}}
							>
								{builder.selectedArmyList?.name} -{" "}
								{builder.selectedArmyList?.name &&
									getKeyByValue(Factions, builder.selectedArmyList.faction)?.replace("_", " ")}
							</Text>
						</View>
					</View>
				),
			});

			const factionListData = getFactionUnits(builder.selectedArmyList?.faction);
			setFactionUnits(factionListData?.factionList?.units);
			//setFactionDetails(factionListData?.factionList);
		}
	}, [builder.selectedArmyList]);

	useEffect(() => {
		const _currentPoints = builder.calculateCurrentArmyPoints();
		if (_currentPoints > 1000 && _currentPoints < 2000) setTotalPoints(2000);
		if (_currentPoints > 2000 && _currentPoints < 3000) setTotalPoints(3000);
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
		console.log(`BuilderEdit: Adding ${unitName} with a max count of ${maxCount} and a min req of ${minCount} `);

		points && builder.addUnit(unitName, points, isLeader, maxCount, minCount, ignoreBreakPoint);
	};
	const handleAddUpgradeToUnitPress = (
		unitName: string,
		type: string,
		points: number,
		upgradeName: string,
		maxCount?: number,
		armyLimitMaxCount?: number
	) => {
		console.log(`BuilderEdit: Adding ${upgradeName} to ${unitName} with a max count of ${maxCount} `);
		builder.addItem(unitName, type, points, upgradeName, maxCount, armyLimitMaxCount);
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
		if (builder?.selectedArmyList) {
			// set leaders
			const _leaders = builder?.selectedArmyList?.selectedUnits
				.filter((x) => x.isLeader)
				.sort(({ order: a }, { order: b }) => b + a);
			const _frontLineUnits = builder?.selectedArmyList?.selectedUnits
				?.filter((x) => !x.isLeader)
				.sort(({ order: a }, { order: b }) => b + a);

			// set frontline
			const _sectionListData: sectionListDataProps[] = [
				{ title: "Leaders", data: _leaders },
				{ title: "Units", data: _frontLineUnits },
			];

			setSectionListData(_sectionListData);
		}
	}, [builder?.selectedArmyList, builder?.selectedArmyList?.selectedUnits]);
	const getUnitCounts = () => {
		// ARMY SPECIAL RULE: special rule for bretonnians
		let units = builder.selectedArmyList?.selectedUnits.filter((x) => !x.isLeader);
		// filter out noBreak units
		units = units?.filter((x) => !x.ignoreBreakPoint);
		// get total counts
		const totalCounts = units?.map((x) => x.currentCount);
		const sumOfPoints = totalCounts?.reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}, 0);
		let breakCount = sumOfPoints ? Math.round(sumOfPoints / 2) : 0;
		// ARMY SPECIAL RULES
		if (builder.factionDetails?.name == "Nippon") {
			breakCount = breakCount + 1;
		}
		const unitCount = sumOfPoints;
		return `${breakCount}/${unitCount}`;
	};

	const transformArmySpecialRules = () => {
		if (builder.factionDetails && builder.factionDetails?.armyRules) {
			const updatedArmyRules: string = builder.factionDetails?.armyRules[0];
			return updatedArmyRules;
		}
		return null;
	};
	const handleRemoveUnit = (unitId: string, unitPoints: number) => {
		builder.removeUnit(unitId, unitPoints);
	};

	const handleOnUnitCardPress = (unitName: string) => {
		const _unit = factionUnits?.find((x) => x.name == unitName);
		if (_unit) {
			console.log(`UNIT FOUN D for ${unitName}`);

			setSelectedUnitDetails(_unit);
			setUnitPreviewVisible(true);
		} else {
			console.error(`UNIT NOT FOUND for ${unitName}`);
		}
	};
	const handleOnUpgradePress = (upgradeName: string) => {
		let _upgrades: UpgradesProps | undefined = magicItemsList.upgrades.find((x) => x.name == upgradeName);
		if (!_upgrades) {
			_upgrades = builder.factionDetails?.upgrades?.find((x) => x.name == upgradeName);
		}
		if (_upgrades) {
			console.log("upgrade found");
			setCurrentUpgradeDetails(_upgrades);
			setUpgradePreviewVisible(true);
		} else {
			console.error("upgrade not found");
		}
	};
	const [currentUpgradeDetails, setCurrentUpgradeDetails] = useState<UpgradesProps | undefined>();
	// **ADD MAGICITEMS
	// TODO: COMPRESS THIS FUNCTION AS THIS NEEDS REFACTORING
	const handleAddMagicItemPress = (unitName: string, unitType: string) => {
		// get all magic items
		setSelectedUnit(unitName);
		const selectedUnit = builder.selectedArmyList?.selectedUnits.find((x) => x.unitName == unitName);
		// TODO: extract all this into a seperate use effect.
		const itemsArray: any = magicItemsList.upgrades;
		const magicItemConstraints = magicItemsList.upgradeConstraints;
		const factionUpgrades = builder.factionDetails?.upgrades;
		factionUpgrades?.map((x) => {
			if (builder.factionDetails?.specialRules) {
				const upgradeText = builder.factionDetails?.specialRules[x.name]?.text;
				x.text = upgradeText;
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
		// get upgrades specific to this unit TYPE
		// let permittedUpgrades = magicItemConstraints.map((unitConstraint) => {
		// 	const upgradesPermitted = unitConstraint.unitType.some((x) => x.includes(unitType));
		// 	if (upgradesPermitted) return unitConstraint.upgrades;
		// 	else return false;
		// });
		//if given the upgrade of wizard, all the user to have wizard items
		let permittedUpgrades = [];
		const unitHasWizardUpgrade = selectedUnit?.attachedItems.find((x) => x.upgradeName == "Wizard");
		if (unitHasWizardUpgrade) {
			permittedUpgrades = magicItemConstraints.map((ui) => {
				const upgradePermitted = ui.unitType.some((x) => x.includes(unitType) || x.includes("Wizard"));
				if (upgradePermitted) {
					return ui.upgrades;
				} else {
					return;
				}
			});
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
		specificUpgradesForUnitArr.forEach((up) => {
			const unitHasArmour = unitDetails?.armour ? unitDetails?.armour : null;
			const unitHits = unitDetails?.hits ? unitDetails?.hits : null;

			let pointsCost;
			if (up.points == undefined) {
				console.error(up.name, "UPGRAADE WITH UNDEFINED");
			}
			if (up.name == "Banner of Shielding") {
				if (unitHasArmour) {
					pointsCost = up.points[unitHasArmour];
					console.log(pointsCost, "pointsCost");
					if (pointsCost) up.points = pointsCost;
				}
			}
			if (up.name == "Banner of Steadfastness") {
				if (unitHasArmour && unitDetails?.armour !== "-") {
					pointsCost = up.points[unitHasArmour];
					console.log(pointsCost, "pointsCost");

					if (pointsCost) up.points = pointsCost;
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
			<View
				style={{
					justifyContent: "space-between",
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 12,
					paddingVertical: 8,
				}}
			>
				<View>
					<Text style={{ fontSize: 16 }}>{getUnitCounts()}</Text>
				</View>
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
						<Text style={{ textTransform: "uppercase" }}>{title}</Text>
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
									key={item.id}
									existingUnits={item.currentCount}
									unit={unitDetails}
									unitUpgrades={item.attachedItems}
									onShowUnitDetails={() => console.log("showUnitDetails")}
									onDeleteUnit={() => handleRemoveUnit(item.id, unitDetails.points)}
									onAddUpgrade={() => handleAddMagicItemPress(item.unitName, unitDetails.type)}
									onRemoveUpgrade={handleRemoveUpgrade}
									onUnitCardPress={handleOnUnitCardPress}
									onUpgradePress={handleOnUpgradePress}
								/>
							</>
						);
					} else {
						return <Text>NOT FOUND</Text>;
					}
				}}
			/>
			{/* // points verification container */}
			<View style={{ position: "absolute", bottom: 10, left: 20, flexDirection: "row" }}>
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
								? factionUnits?.filter((x) => !x.command)
								: factionUnits?.filter((x) => x.command)
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
			<UnitPreview
				handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
				visible={unitPreviewVisible}
				selectedUnitDetails={selectedUnitDetails}
			/>
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
