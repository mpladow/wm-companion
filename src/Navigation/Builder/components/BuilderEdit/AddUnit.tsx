import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { UnitProps } from "@utils/types";
import { getFactionUnits, getGenericSpecialRules } from "@utils/factionHelpers";
import { useBuilderContext } from "@context/BuilderContext";
import { sectionListDataProps } from "../../BuilderEdit";
import UnitCard from "../UnitCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainContainerWithBlankBG from "@components/MainContainerWithBlankBG";
import ArmyPointsCount from "../ArmyPointsCount";
import { useTheme } from "@hooks/useTheme";
import { Button, Text } from "@components/index";

export type AddUnitProps = {
	addingUnits: boolean;
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
const AddUnit = ({ route, navigate }) => {
	const { theme } = useTheme();
	const { addingUnits } = route.params;
	const navigation = useNavigation();
	const builder = useBuilderContext();
	const [factionUnits, setFactionUnits] = useState<UnitProps[] | undefined>(); //TODO: we NEED to strongly type this data
	const [sectionListData, setSectionListData] = useState<sectionListDataProps[]>([]);
	const [totalPoints, setTotalPoints] = useState(1000);
	const [errorsVisible, setErrorsVisible] = useState(false);
	const armyCount = useMemo(() => {
		return `${builder.calculateCurrentArmyPoints()}/${totalPoints}`;
	}, [builder.calculateCurrentArmyPoints(), totalPoints]);

	useEffect(() => {
		console.log("ChECKING ARMY POINTS");
		const _currentPoints = builder.calculateCurrentArmyPoints();
		if ((_currentPoints > 1000 && _currentPoints < 2000) || _currentPoints == 2000) setTotalPoints(2000);
		if ((_currentPoints > 2000 && _currentPoints < 3000) || _currentPoints == 3000) setTotalPoints(3000);
		if (_currentPoints > 3000 && _currentPoints < 4000) setTotalPoints(4000);
		if (_currentPoints > 4000 && _currentPoints < 5000) setTotalPoints(5000);
		if (_currentPoints > 5000 && _currentPoints < 6000) setTotalPoints(6000);
	}, [builder.calculateCurrentArmyPoints()]);

	useEffect(() => {
		// get all units for selected army list
		if (builder.selectedArmyList) {
			navigation.setOptions({
				title: addingUnits ? "Recruit Unit" : "Recruit Leaders",
				// headerTitle: (props: any) => (
				// 	<View style={{ flexDirection: "row"}}>
				// 		<View>
				// 			<Text
				// 				numberOfLines={1}
				// 				variant='heading3'
				// 				style={{
				// 					fontSize: 20,
				// 				}}
				// 			>
				// 				Add Unit
				// 			</Text>
				// 		</View>
				// 	</View>
				// ),
			});

			const factionListData = getFactionUnits(builder.selectedArmyList?.faction);
			setFactionUnits(factionListData?.factionList?.units);
		}
	}, [builder.selectedArmyList]);

	useEffect(() => {
		if (builder.selectedArmyList) {
			const factionListData = getFactionUnits(builder.selectedArmyList?.faction);
			setFactionUnits(factionListData?.factionList?.units);
		}
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

	const handleOnUnitCardPress = (unitName: string) => {
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

			// setSelectedUnitDetails(_unit);
			// setUnitPreviewVisible(true);
		} else {
			console.error(`UNIT NOT FOUND for ${unitName}`);
		}
	};
	return (
		<MainContainerWithBlankBG>
			<View>
				<FlatList
					contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
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
						// find current units/leaders in army
						const unitCount = _unit ? _unit.currentCount : 0;
						return (
							<UnitCard
								key={index.toString()}
								unit={item}
								onAddUnitPress={builder.addUnit}
								currentCount={unitCount}
								onUnitCardPress={() => console.log("open unit details")}
								currentArmyCount={builder.calculateCurrentArmyPoints()}
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
					<Text bold>Go Back</Text>
				</Button>
			</View>
		</MainContainerWithBlankBG>
	);
};

export default AddUnit;

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
