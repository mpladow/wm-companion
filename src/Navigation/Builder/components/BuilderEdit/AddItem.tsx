import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { UnitProps, UpgradesProps } from "@utils/types";
import { SelectedUnitProps, useBuilderContext } from "@context/BuilderContext";
import { sectionListDataProps } from "../../BuilderEdit";
import UnitCard from "../UnitCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainContainerWithBlankBG from "@components/MainContainerWithBlankBG";
import ArmyPointsCount from "../ArmyPointsCount";
import { useTheme } from "@hooks/useTheme";
import { Button, Text } from "@components/index";
import { Entypo } from "@expo/vector-icons";
import magicItemsList from "../../../../data/json/wmr/magic-items.json";
import UpgradeCard from "../UpgradeCard";
import UpgradePreview from "../UpgradePreview";
import { getUpgradeDetailsByName } from "@navigation/Builder/utils/builderHelpers";
import _ from "lodash";
import { useFactionUnits } from "@utils/useFactionUnits";
import Constants from "expo-constants";

export type AddItemProps = {
	unitName: string;
	unitType: string;
	// handleAddUnitToArmyPress: (
	// 	unitName: string,
	// 	points: number | undefined,
	// 	isLeader: boolean,
	// 	maxCount?: number,
	// 	minCount?: number,
	// 	ignoreBreakPoint?: boolean
	// ) => void;
	// handleOnUnitCardPress: (name: string) => void;
};
const AddItem = () => {
	const { theme } = useTheme();
	const route = useRoute();
	const { unitName, unitType } = route.params;
	const navigation = useNavigation();
	const builder = useBuilderContext();
	const [totalPoints, setTotalPoints] = useState(1000);
	const [errorsVisible, setErrorsVisible] = useState(false);
	const [magicItems, setMagicItems] = useState<UpgradesProps[]>([]);
	const [selectedUnit, setSelectedUnit] = useState();
	const [upgradePreviewVisible, setUpgradePreviewVisible] = useState(false);
	const [currentUpgradeDetails, setCurrentUpgradeDetails] = useState<UpgradesProps | undefined>();
	const { getFactionUnitsByVersion } = useFactionUnits();
	const armyCount = useMemo(() => {
		return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
	}, [builder.calculateCurrentArmyPoints(), totalPoints]);
	const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

	useEffect(() => {
		const _currentPoints = builder.calculateCurrentArmyPoints();
		if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000) setTotalPoints(2000);
		if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000) setTotalPoints(3000);
		if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
		if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
		if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
	}, [builder.calculateCurrentArmyPoints()]);

	useEffect(() => {
		// get faction list data
		const handleAddMagicItemPress = () => {
			// get all magic items
			setSelectedUnit(unitName);
			const magicItems = builder.getMagicItemsForUnit(unitName);
			setMagicItems(magicItems);
		};
		handleAddMagicItemPress();
	}, [unitName, unitType]);

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
				setCurrentUpgradeDetails(_upgrades);
				setUpgradePreviewVisible(true);
			} else {
				console.error("upgrade not found");
			}
		}
	};
	return (
		<MainContainerWithBlankBG>
			<View>
				<FlatList
					contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
					data={magicItems}
					renderItem={(nestedItem) => {
						const itemStatusInArmy = builder.selectedArmyList?.selectedUpgrades.filter(
							(x) => x.upgradeName == nestedItem.item.name
						);
						return (
							<UpgradeCard
								key={nestedItem.index}
								targetUnitName={unitName}
								upgrade={nestedItem.item}
								onShowUpgradePreview={() => handleOnUpgradePress(nestedItem.item.name)}
								onAddUpgradePress={builder.addItem}
								currentCount={itemStatusInArmy ? itemStatusInArmy.length : 0}
							/>
						);
					}}
				/>

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
			</View>
			<View style={{ zIndex: 9, position: "absolute", bottom: 10, left: 20, flexDirection: "row" }}>
				{/* TODO extract out  */}
				<ArmyPointsCount
					armyErrorsCount={builder.armyErrors.length}
					setVisibility={(visibility) => setErrorsVisible(visibility)}
					armyCount={armyCount}
				/>
			</View>
			<View style={{ zIndex: 9, position: "absolute", bottom: 10, right: 20, flexDirection: "row" }}>
				{/* TODO extract out  */}
				<Button onPress={() => navigation.goBack()} variant={"primary"}>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 4 }}>
						<Entypo name='chevron-left' size={16} color={theme.text} />
						<Text bold>Back</Text>
					</View>
				</Button>
			</View>
			{/* {selectedUnitDetails ? (
				<UnitPreview
					handleSetVisible={(visibility) => setUnitPreviewVisible(visibility)}
					visible={unitPreviewVisible}
					selectedUnitDetails={selectedUnitDetails}
				/>
			) : null} */}
			<UpgradePreview
				handleSetVisible={(visibility) => setUpgradePreviewVisible(visibility)}
				visible={upgradePreviewVisible}
				selectedUpgradeDetails={currentUpgradeDetails}
			/>
		</MainContainerWithBlankBG>
	);
};

export default AddItem;

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
