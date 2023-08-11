import AsyncStorage from "@react-native-async-storage/async-storage";
import { current } from "@reduxjs/toolkit";
import { getFactionUnits, getGenericSpecialRules } from "@utils/factionHelpers";
import { FactionListProps, UpgradesProps } from "@utils/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import uuid from "uuid-random";
import magicItemsList from "./../data/json/wmr/magic-items.json";

type ArmyErrorsProps = {
	source?: "Unit" | "Upgrade";
	sourceName: string;
	error: string;
};
export type SelectedUpgradesProps = {
	id: string;
	upgradeName: string;
	type: string;
	attachedToName: string; // the name of the unit this item is attached to
	points: number;
	currentCount: number;
	maxCount?: number;
	armyLimitMaxCount?: number; // hard limit
};
export type SelectedUnitProps = {
	id: string;
	unitName: string;
	order: number;
	points: number;
	isLeader?: boolean;
	currentCount: number;
	maxCount?: number;
	minCount?: number;
	ignoreBreakPoint?: boolean;
	attachedItems: SelectedUpgradesProps[];
};
export type ArmyListProps = {
	armyId: string;
	faction: number;
	name: string;
	isFavourite: boolean;
	order: number;
	selectedUnits: SelectedUnitProps[];
	selectedUpgrades: SelectedUpgradesProps[];
	points: number;
};
interface BuilderContextInterface {
	userArmyLists: ArmyListProps[];
	addUserArmyList: (faction: number, name: string) => Promise<string>;
	deleteUserArmyList: (armyId: string) => void;
	//duplicateArmyList: (armyId: number) => void;
	setSelectedArmyList: (armyId: string) => void;
	selectedArmyList?: ArmyListProps;
	//armyName: string;
	updateArmyName: (name: string, armyId: string) => void;
	toggleFavourite: (armyId: string) => void;
	addUnit: (
		unitName: string,
		points: number,
		isLeader: boolean,
		maxCount?: number,
		minCount?: number,
		ignoreBreakPoint?: boolean
	) => void;
	removeUnit: (unitId: string) => void;
	addItem: (
		unitName: string,
		type: string,
		points: number,
		magicItemName: string,
		maxCount?: number,
		armyLimitMaxCount?: number
	) => void;
	removeItem: (unitName: string, upgradeId: string) => void;
	updateUserArmyLists: () => void;
	setCurrentFaction: (faction: number) => void;
	currentFaction?: number;
	calculateCurrentArmyPoints: () => number;
	factionDetails?: FactionListProps;
	armyErrors: ArmyErrorsProps[];
}

const BuilderContext = createContext<BuilderContextInterface>({} as BuilderContextInterface);

export const BuilderContextProvider = ({ children }: any) => {
	const [faction, setFaction] = useState<number | undefined>();
	const [currentArmyList, setCurrentArmyList] = useState<ArmyListProps>();
	const [userArmyLists, setUserArmyLists] = useState<ArmyListProps[]>([]);
	const [factionDetails, setFactionDetails] = useState<FactionListProps | undefined>({});
	const [armyErrors, setArmyErrors] = useState<ArmyErrorsProps[]>([] as ArmyErrorsProps[]);
	useEffect(() => {
		getScoresFromStorage();
	}, []);
	useEffect(() => {
		// save changes to local storage
		updateStorage();
	}, [userArmyLists]);
	const setCurrentFaction = (faction: number) => {
		setFaction(faction);
	};

	// HANDLE LOCAL STORAGE MANAGEMENT
	const getScoresFromStorage = async () => {
		try {
			// get user army lists from storage
			const userArmyLists = await AsyncStorage.getItem(`userArmies`);

			const userArmyListObj: ArmyListProps[] = userArmyLists && JSON.parse(userArmyLists);
			if (userArmyListObj) {
				setUserArmyLists(userArmyListObj);
			}
		} catch (e) {}
	};
	const updateStorage = async () => {
		try {
			await AsyncStorage.setItem(`userArmies`, JSON.stringify(userArmyLists));
		} catch (e) {}
	};

	const getUserArmyList = () => {
		return userArmyLists;
	};
	const addUserArmyList = async (faction: number, name: string) => {
		const newArmyList: ArmyListProps = {
			armyId: uuid(),
			faction: faction,
			name: name,
			isFavourite: false,
			order: getUserArmyList.length + 1,
			selectedUnits: [],
			selectedUpgrades: [],
			points: 0,
		};
		setUserArmyLists([...userArmyLists, newArmyList]);
		return newArmyList.armyId;
	};

	const updateArmyName = (name: string, armyId: string) => {
		setUserArmyLists((prev) => {
			const armyListToUpdateIndex = prev.findIndex((x) => x.armyId == armyId);
			const _selectedArmyList = Object.assign(
				{},
				prev.find((x) => x.armyId == armyId)
			);
			_selectedArmyList.name = name;
			const updatedSelectedUnits = [
				...prev.slice(0, armyListToUpdateIndex),
				_selectedArmyList,
				...prev.slice(armyListToUpdateIndex + 1),
			];
			return updatedSelectedUnits;
		});
	};

	useEffect(() => {
		if (currentArmyList) {
			updateUserArmyLists();
			// update points count
			setArmyErrors(calculateArmyErrors());
		}
	}, [currentArmyList]);
	// useEffect(() => {
	// 	if (currentArmyList) {
	// 		console.log("BUILDERCONTEXT:: calculating army points");
	// 		const currentCount = calculateCurrentArmyPoints();
	// 		currentArmyList.points = currentCount;
	// 	}
	// }, [currentArmyList?.selectedUnits]);
	const updateUserArmyLists = (armyIdUpdated?: string) => {
		const armyListToUpdateIndex = userArmyLists.findIndex((x) => x.armyId == currentArmyList?.armyId);
		if (currentArmyList) {
			setUserArmyLists((prev) => {
				const updatedSelectedUnits = [
					...prev.slice(0, armyListToUpdateIndex),
					currentArmyList,
					...prev.slice(armyListToUpdateIndex + 1),
				];
				return updatedSelectedUnits;
			});
		}
	};

	const deleteUserArmyList = (armyId: string) => {
		setUserArmyLists((prev) => {
			const updatedUserArmyLists = userArmyLists.filter((u) => u.armyId != armyId);
			return updatedUserArmyLists;
		});
	};

	const setSelectedArmyList = (armyId: string, faction?: number) => {
		// once user selects army, set selectedUnits, name,
		const selectedList = userArmyLists.find((x) => x.armyId == armyId);
		if (selectedList) {
			selectedList.points = calculateCurrentArmyPoints(selectedList);
			const _factionDetails = getFactionUnits(selectedList?.faction);
			// set faction upgrade tails
			factionDetails && setFactionDetails(_factionDetails.factionList);
			setCurrentArmyList(selectedList);
		} else {
			if (faction) {
				const factionDetails = getFactionUnits(faction);
				factionDetails && setFactionDetails(_factionDetails.factionList);
				setCurrentArmyList(selectedList);
			}
		}
	};

	const toggleFavourite = (armyId: string) => {
		setCurrentArmyList((prev) => {
			const updatedArmy = Object.assign({}, prev);
			updatedArmy.isFavourite = !updatedArmy.isFavourite;
			return updatedArmy;
		});
	};
	const addUnit = (
		unitName: string,
		unitPoints: number,
		isLeader: boolean,
		maxCount?: number,
		minCount?: number,
		ignoreBreakPoint?: boolean
	) => {
		const currentUnit = factionDetails && factionDetails.units?.find((x) => x.name == unitName);
		const newUnit: SelectedUnitProps = {
			id: uuid(),
			unitName: unitName,
			order: currentUnit.order ? currentUnit.order : 1,
			attachedItems: [],
			points: unitPoints,
			isLeader: isLeader,
			currentCount: 1,
			maxCount: maxCount,
			minCount: minCount,
			ignoreBreakPoint: ignoreBreakPoint,
		};

		setCurrentArmyList((prev) => {
			// find if unit exists in selected units
			const updatedArmy = Object.assign({}, prev);
			const unit = updatedArmy?.selectedUnits.find((u) => u.unitName == unitName);
			const unitIndex = updatedArmy?.selectedUnits.findIndex((u) => u.unitName == unitName);

			if (unit) {
				// if it does, update the count for this unit
				unit.currentCount = unit.currentCount + 1;
				const updatedSelected = [
					...updatedArmy.selectedUnits.slice(0, unitIndex),
					unit,
					...updatedArmy.selectedUnits.slice(unitIndex + 1),
				];
				updatedArmy.selectedUnits = updatedSelected;
			} else {
				// else add this unit to the selected units
				calculateCurrentArmyPoints();
				updatedArmy.selectedUnits.push(newUnit);
			}
			updatedArmy.points = calculateCurrentArmyPoints();
			// update total army points
			return updatedArmy;
		});
	};
	const removeUnit = (unitId: string) => {
		setCurrentArmyList((prev) => {
			const updatedArmy = Object.assign({}, prev);
			const unitExists = updatedArmy.selectedUnits.find((x) => x.id == unitId);
			const unitExistsIndex = updatedArmy.selectedUnits.findIndex((x) => x.id == unitId);
			if (unitExists) {
				if (unitExists.currentCount && unitExists.currentCount > 1) {
					console.log("removeUnit: unitCount greater than 0, removing 1 from currentCount");
					unitExists.currentCount = unitExists.currentCount - 1;
					const updatedSelected = [
						...updatedArmy.selectedUnits.slice(0, unitExistsIndex),
						unitExists,
						...updatedArmy.selectedUnits.slice(unitExistsIndex + 1),
					];
					updatedArmy.selectedUnits = updatedSelected;
				} else {
					console.log("removeUnit: unit <1 - removing from arrays");
					updatedArmy.selectedUnits = updatedArmy.selectedUnits.filter((x) => x.id != unitId);
				}
			}
			updatedArmy.points = calculateCurrentArmyPoints();
			// update count
			return updatedArmy;
		});
	};

	// TODO
	const addItem = (
		unitName: string,
		type: string,
		points: number,
		itemName: string,
		maxCount?: number,
		armyLimitMaxCount?: number
	) => {
		console.log(`addItem:: ADDING ITEM ${itemName} to ${unitName}`);
		const newUpgrade: SelectedUpgradesProps = {
			id: uuid(),
			upgradeName: itemName,
			type: type,
			attachedToName: unitName,
			currentCount: 1,
			points: points,
			maxCount: maxCount,
			armyLimitMaxCount: armyLimitMaxCount,
		};

		setCurrentArmyList((prev) => {
			const updatedArmy = Object.assign({}, prev);
			updatedArmy.selectedUpgrades.push(newUpgrade);
			// find unit
			const unit = updatedArmy.selectedUnits.find((x) => x.unitName == unitName);
			const unitIndex = updatedArmy.selectedUnits.findIndex((x) => x.unitName == unitName);
			console.log(
				`addItem:: finding unit ${unit?.unitName} with an index of ${unitIndex} and an attached item count of ${unit?.attachedItems.length}`
			);

			if (unit != undefined && unitIndex != undefined) {
				// find upgrade
				const unitUpgrade = unit?.attachedItems.find((x) => x.upgradeName == itemName);
				const unitUpgradeIndex = unit?.attachedItems.findIndex((x) => x.upgradeName == itemName);
				console.log(
					`addItem:: finding upgrade ${unitUpgrade?.upgradeName} with an index of ${unitUpgradeIndex} and a count of ${unitUpgrade?.currentCount}`
				);

				if (unitUpgrade != undefined && unitUpgradeIndex != undefined && unitUpgrade.currentCount > 0) {
					// update
					console.log("addItem:: add item");
					unitUpgrade.currentCount = unitUpgrade.currentCount + 1;
					// update upgrades
					const updatedUpgrades = [
						...unit?.attachedItems.slice(0, unitUpgradeIndex),
						unitUpgrade,
						...unit.attachedItems.slice(unitUpgradeIndex + 1),
					];
					unit.attachedItems = updatedUpgrades;
					const updatedUnit = [
						...updatedArmy.selectedUnits.slice(0, unitIndex),
						unit,
						...updatedArmy.selectedUnits.slice(unitIndex + 1),
					];
					updatedArmy.selectedUnits = updatedUnit;
				} else {
					console.log("addItem:: add item since it does not exist");
					updatedArmy.selectedUnits.find((x) => x.unitName == unitName)?.attachedItems.push(newUpgrade); // push upgrade
					const updatedUnit = [
						...updatedArmy.selectedUnits.slice(0, unitIndex),
						unit,
						...updatedArmy.selectedUnits.slice(unitIndex + 1),
					];
					updatedArmy.selectedUnits = updatedUnit;
				}
				updatedArmy.points = calculateCurrentArmyPoints();
			}
			return updatedArmy;
		});
	};
	const removeItem = (unitName: string, upgradeId: string) => {
		//TODO: extract this into a helpfer function
		// find unit that has attached items
		//TODO: extract this into a seperate functionc
		//
		setCurrentArmyList((prev) => {
			const updatedArmy = Object.assign({}, prev);
			// find unit
			const unit = updatedArmy.selectedUnits.find((x) => x.unitName == unitName);
			const unitIndex = updatedArmy.selectedUnits.findIndex((x) => x.unitName == unitName);

			// find upgrade
			const unitUpgrade = unit?.attachedItems.find((x) => x.id == upgradeId);
			const unitUpgradeIndex = unit?.attachedItems.findIndex((x) => x.id == upgradeId);
			if (!unit) {
				console.error("NO UNIT FOUND");
				return;
			}
			if (unitUpgrade != undefined && unitUpgradeIndex != undefined && unitUpgrade?.currentCount > 1) {
				console.log("removeUnit: unitCount greater than 0, removing 1 from currentCount");
				unitUpgrade.currentCount = unitUpgrade.currentCount - 1;
				//update upgrades array
				const updatedUpgrades = [
					...unit.attachedItems.slice(0, unitUpgradeIndex),
					unitUpgrade,
					...unit.attachedItems.slice(unitUpgradeIndex + 1),
				];
				unit.attachedItems = updatedUpgrades;
				const updatedUnit = [
					...updatedArmy.selectedUnits.slice(0, unitIndex),
					unit,
					...updatedArmy.selectedUnits.slice(unitIndex + 1),
				];
				updatedArmy.selectedUnits = updatedUnit;
			} else {
				console.log("removeUnit: unit <1 - removing from arrays");
				const updatedArray = unit.attachedItems.filter((x) => x.id != upgradeId);
				unit.attachedItems = updatedArray;
				const updatedUnit = [
					...updatedArmy.selectedUnits.slice(0, unitIndex),
					unit,
					...updatedArmy.selectedUnits.slice(unitIndex + 1),
				];
				updatedArmy.selectedUnits = updatedUnit;
			}
			updatedArmy.points = calculateCurrentArmyPoints();
			// this WON"T work because we do not have the id for these itesm@! just remove
			if (updatedArmy.selectedUpgrades.length == 1) {
				updatedArmy.selectedUpgrades = [];
			} else {
				updatedArmy.selectedUpgrades = updatedArmy.selectedUpgrades.splice(-1, 1);
			}
			// update count
			return updatedArmy;
		});
	};

	const calculateCurrentArmyPoints = (targetArmyList?: ArmyListProps) => {
		// get current army
		let arrayOfPoints = 0;
		let armyList: ArmyListProps | undefined = undefined;
		if (targetArmyList) {
			armyList = targetArmyList;
		} else {
			armyList = currentArmyList;
		}
		if (armyList)
			armyList?.selectedUnits?.map((unit) => {
				// add points for selectedUnits
				const amountToAdd = unit.points * unit.currentCount;
				arrayOfPoints = arrayOfPoints + amountToAdd;
				//add points for selected items
				unit.attachedItems.map((up) => {
					const amountToAdd = up.points * up.currentCount;
					arrayOfPoints = arrayOfPoints + amountToAdd;
				});
			});
		// setCurrentArmyList(prev => {
		// 	const x = Object.assign({}, prev);
		// 	x.points = arrayOfPoints;
		// 	return x
		// })
		currentArmyList?.points;
		return arrayOfPoints;
	};

	const calculateArmyErrors = () => {
		// get the current army points for
		let currentArmyPointsLimit = Math.floor(calculateCurrentArmyPoints() / 1000);
		if (currentArmyPointsLimit == 0) currentArmyPointsLimit = 1;
		const errors: ArmyErrorsProps[] = [];
		let currentUnits = factionDetails?.units;
		// count all magic items in army
		const itemCounts: any = {};
		if (currentArmyList?.selectedUpgrades)
			for (let i = 0; i < currentArmyList.selectedUpgrades.length; i++) {
				const element = currentArmyList.selectedUpgrades[i];
				itemCounts[element.upgradeName] = (itemCounts[element.upgradeName] || 0) + 1;
			}
		const itemEntries = Object.keys(itemCounts);
		itemEntries.map((key) => {
			let count = itemCounts[key];
			const selectedUpgrade = currentArmyList?.selectedUpgrades.find((x) => x.upgradeName == key);
			if (selectedUpgrade && selectedUpgrade?.armyLimitMaxCount !== undefined) {
				if (count > selectedUpgrade.armyLimitMaxCount) {
					errors.push({
						source: "Upgrade",
						sourceName: selectedUpgrade.upgradeName,
						error: `Upgrade: A maximum of ${selectedUpgrade.armyLimitMaxCount} ${selectedUpgrade.upgradeName}/s in the army is permitted.`,
					});
				}
			}
			if (selectedUpgrade && selectedUpgrade?.maxCount != undefined) {
				const maxCountPer1000 = currentArmyPointsLimit * selectedUpgrade.maxCount;
				if (count > maxCountPer1000) {
					errors.push({
						source: "Upgrade",
						sourceName: selectedUpgrade.upgradeName,
						error: `Upgrade: A maximum of ${selectedUpgrade.maxCount} ${selectedUpgrade.upgradeName}/s per 1000pts is permitted.`,
					});
				}
			}
		});
		// check for army mins, if no army min
		const unitsWithArmyMin = currentUnits?.filter((x) => {
			if (x["armyMin"] != undefined || x["min"] != undefined) {
				return x;
			}
		});
		const unitsWithArmyMax = currentUnits?.filter((x) => {
			if (x["armyMax"] != undefined) {
				return x;
			}
		});

		// check no mounts exceed total count per character
		currentArmyList?.selectedUnits.forEach((cu) => {
			const unitHasMount = cu.attachedItems
				.filter((ai) => ai.type?.includes("Mount"))
				.map((x) => {
					if (x.currentCount) return x.currentCount;
				});
			if (unitHasMount.length > 0 && unitHasMount != null) {
				const mountCount = unitHasMount.reduce((prev, curr) => {
					if (curr != undefined && prev != undefined) return prev + curr;
				}, 0);
				if (mountCount && mountCount > 1) {
					errors.push({
						source: "Unit",
						sourceName: cu.unitName,
						error: `Mount: ${cu.unitName} has too many mounts.`,
					});
				}
			}
		});

		// check unit with army Min count - i.e.,  Generals
		unitsWithArmyMin?.map((u) => {
			const unitExists = currentArmyList?.selectedUnits?.find((x) => x.unitName == u.name);
			if (unitExists) {
				// if count > == u count
				const isValid = unitExists.currentCount >= u.armyMin || unitExists.currentCount >= u.min;
				if (!isValid) {
					errors.push({
						source: "Unit",
						sourceName: unitExists.unitName,
						error: `Unit: A minimum of ${u.armyMin ? u.armyMin : u.min} ${
							unitExists.unitName
						}/s in the army is required.`,
					});
				}
			} else {
				errors.push({
					sourceName: u.name,
					error: `Unit: A minimum of ${u.armyMin ? u.armyMin : u.min} ${u.name}/s in the army is required.`,
				});
			}
		});
		// check unit with army MAx Count
		unitsWithArmyMax?.map((u) => {
			const unitExists = currentArmyList?.selectedUnits?.find((x) => x.unitName == u.name);
			if (unitExists) {
				// if count > == u count
				const isValid = unitExists.currentCount <= u.armyMax;
				if (!isValid) {
					errors.push({
						sourceName: unitExists.unitName,
						error: `Unit: A maximum of ${u.armyMax} ${unitExists.unitName}/s in the army is required.`,
					});
				}
			}
		});
		// filter out the above
		currentUnits = currentUnits?.filter((u) => {
			return unitsWithArmyMax?.map((x) => x.name).indexOf(u.name);
		});
		currentArmyList?.selectedUnits?.map((unit) => {
			// check max count

			if (unit.maxCount) {
				const maxCountPer1000Points = unit.maxCount * currentArmyPointsLimit;
				if (unit.currentCount > maxCountPer1000Points) {
					errors.push({
						sourceName: unit.unitName,
						error: `Unit: A maximum of ${unit.maxCount} ${unit.unitName}/s per 1000pts is permitted.`,
					});
				}
			}
		});

		return errors;
	};

	return (
		<BuilderContext.Provider
			value={{
				userArmyLists,
				addUserArmyList,
				deleteUserArmyList,
				setSelectedArmyList,
				selectedArmyList: currentArmyList,
				updateArmyName,
				toggleFavourite,
				addUnit,
				removeUnit,
				updateUserArmyLists,
				setCurrentFaction,
				currentFaction: faction,
				addItem,
				removeItem,
				calculateCurrentArmyPoints,
				factionDetails,
				armyErrors,
			}}
		>
			{children}
		</BuilderContext.Provider>
	);
};

export const useBuilderContext = () => {
	return useContext(BuilderContext);
};
