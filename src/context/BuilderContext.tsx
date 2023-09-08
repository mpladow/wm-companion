import { get1000PointInterval } from "@navigation/Builder/utils/builderHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { current } from "@reduxjs/toolkit";
import { UpgradeTypes } from "@utils/constants";
import { getFactionUnits, getGenericSpecialRules } from "@utils/factionHelpers";
import { FactionListProps, UnitProps, UpgradesProps } from "@utils/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import uuid from "uuid-random";

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
	points?: number;
	isLeader?: boolean;
	currentCount: number;
	maxCount?: number;
	minCount?: number;
	ignoreBreakPoint?: boolean;
	attachedItems: SelectedUpgradesProps[];
	requiredUnits?: string[];
};
export type ArmyListProps = {
	armyId: string;
	faction: number;
	name: string;
	isFavourite: boolean;
	armyNotes?: string;
	order: number;
	selectedUnits: SelectedUnitProps[];
	selectedUpgrades: SelectedUpgradesProps[];
	points: number;
};
interface BuilderContextInterface {
	userArmyLists: ArmyListProps[];
	addUserArmyList: (faction: number, name: string, autopopulate: boolean) => Promise<string>;
	deleteUserArmyList: (armyId: string) => void;
	//duplicateArmyList: (armyId: number) => void;
	setSelectedArmyList: (armyId: string) => void;
	selectedArmyList?: ArmyListProps;
	//armyName: string;
	updateArmyName: (name: string, armyId: string) => void;
	toggleFavourite: (armyId: string) => void;
	updateArmyNotes: (armyId: string, notes: string) => void;
	addUnit: (
		unitName: string,
		points?: number,
		isLeader?: boolean,
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
	getArmyByArmyId: (armyId: string) => ArmyListProps | undefined;
	getUnitCounts: () => string;
}

const BuilderContext = createContext<BuilderContextInterface>({} as BuilderContextInterface);

export const BuilderContextProvider = ({ children }: any) => {
	const [faction, setFaction] = useState<number | undefined>();
	const [currentArmyList, setCurrentArmyList] = useState<ArmyListProps>();
	const [userArmyLists, setUserArmyLists] = useState<ArmyListProps[]>([]);
	const [factionDetails, setFactionDetails] = useState<FactionListProps | undefined>({});
	const [armyErrors, setArmyErrors] = useState<ArmyErrorsProps[]>([] as ArmyErrorsProps[]);
	useEffect(() => {
		//AsyncStorage.removeItem(`userArmies`);
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

	const getArmyByArmyId = (armyId: string) => {
		return userArmyLists.find((x) => x.armyId == armyId);
	};
	const getUserArmyList = () => {
		return userArmyLists;
	};
	const addUserArmyList = async (faction: number, name: string, autopopulate: boolean) => {
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
		// autopopulate if true
		const _factionDetails = getFactionUnits(faction);
		// set faction upgrade tails
		factionDetails && setFactionDetails(_factionDetails.factionList);

		if (autopopulate) {
			// get unit details
			const factionUnits = _factionDetails.factionList?.units?.filter(
				(x) => x["min"] != undefined || x["armyMin"] != undefined
			);
			// find min requirements
			const defaultUnits: SelectedUnitProps[] = [];
			factionUnits.forEach((x) => {
				let max;
				if (x.max) max = x.max;
				if (x.armyMax) max = x.armyMax;
				let min;
				if (x.min) min = x.min;
				if (x.armyMin) min = x.armyMin;

				const _newUnit: SelectedUnitProps = {
					id: uuid(),
					unitName: x.name,
					order: x.order ? x.order : 1,
					attachedItems: [],
					points: x.points,
					isLeader: x.command || x.command == 0 ? true : false,
					currentCount: min,
					maxCount: max,
					minCount: x.min ? x.min : x.armyMin,
					ignoreBreakPoint: x.noCount,
				};
				defaultUnits.push(_newUnit);
			});
			newArmyList.selectedUnits = defaultUnits;
		}
		newArmyList.points = calculateCurrentArmyPoints(newArmyList);

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
		setUserArmyLists((prev) => {
			const armyListToUpdateIndex = prev.findIndex((x) => x.armyId == armyId);
			const _selectedArmyList = Object.assign(
				{},
				prev.find((x) => x.armyId == armyId)
			);
			_selectedArmyList.isFavourite = !_selectedArmyList.isFavourite;
			const updatedSelectedUnits = [
				...prev.slice(0, armyListToUpdateIndex),
				_selectedArmyList,
				...prev.slice(armyListToUpdateIndex + 1),
			];
			return updatedSelectedUnits;
		});
	};

	const updateArmyNotes = (armyId: string, notes: string) => {
		setUserArmyLists((prev) => {
			const armyListToUpdateIndex = prev.findIndex((x) => x.armyId == armyId);
			const _selectedArmyList = Object.assign(
				{},
				prev.find((x) => x.armyId == armyId)
			);
			_selectedArmyList.armyNotes = notes;
			const updatedSelectedUnits = [
				...prev.slice(0, armyListToUpdateIndex),
				_selectedArmyList,
				...prev.slice(armyListToUpdateIndex + 1),
			];
			return updatedSelectedUnits;
		});
	};
	const addUnit = (
		unitName: string,
		unitPoints?: number,
		isLeader?: boolean,
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
			requiredUnits: currentUnit.requiredUnits,
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
			if (unitExists && unitExistsIndex > -1) {
				if (unitExists.currentCount && unitExists.currentCount > 1) {
					unitExists.currentCount = unitExists.currentCount - 1;
					const updatedSelected = [
						...updatedArmy.selectedUnits.slice(0, unitExistsIndex),
						unitExists,
						...updatedArmy.selectedUnits.slice(unitExistsIndex + 1),
					];
					updatedArmy.selectedUnits = updatedSelected;
				} else {
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

			if (unit != undefined && unitIndex > -1) {
				// find upgrade
				const unitUpgrade = unit?.attachedItems.find((x) => x.upgradeName == itemName);
				const unitUpgradeIndex = unit?.attachedItems.findIndex((x) => x.upgradeName == itemName);
				if (unitUpgrade != undefined && unitUpgradeIndex != undefined && unitUpgrade.currentCount > 0) {
					// update
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
				console.error("BuilderContext :: removeItem :: NO UNIT FOUND");
				return;
			}
			if (unitUpgrade != undefined && unitUpgradeIndex != undefined && unitUpgrade?.currentCount > 1) {
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

			const armyUpgradeIndex = updatedArmy?.selectedUpgrades?.findIndex(
				(x) => x.upgradeName == unitUpgrade?.upgradeName
			);

			if (armyUpgradeIndex > -1) updatedArmy?.selectedUpgrades?.splice(armyUpgradeIndex, 1);

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
		let currentArmyPointsLimit = get1000PointInterval(calculateCurrentArmyPoints());

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
		currentArmyList?.selectedUnits
			.filter((x) => x.isLeader)
			.forEach((cu) => {
				const unitHasMount = cu.attachedItems
					.filter((ai) => ai.type?.includes("Mount"))
					.map((x) => {
						if (x.currentCount) return x.currentCount;
					});
				if (unitHasMount.length > 0 && unitHasMount != null) {
					const mountCount = unitHasMount.reduce((prev, curr) => {
						if (curr != undefined && prev != undefined) return prev + curr;
					}, 0);
					if (mountCount && mountCount > cu.currentCount) {
						errors.push({
							source: "Unit",
							sourceName: cu.unitName,
							error: `Mount: ${cu.unitName} has too many mounts.`,
						});
					}
				}
			});
		// check if any unit has any required units
		const unitWithRequiredUnits = currentArmyList?.selectedUnits.find(
			(x) => x.requiredUnits !== undefined && x.requiredUnits.length > 0
		);

		if (unitWithRequiredUnits && unitWithRequiredUnits.requiredUnits !== undefined) {
			const requiredUnitsExists = currentArmyList?.selectedUnits.find(
				(x) => x.unitName == unitWithRequiredUnits.requiredUnits[0]
			);
			if (!requiredUnitsExists) {
				errors.push({
					source: "Unit",
					sourceName: unitWithRequiredUnits.unitName,
					error: `Required Unit: ${unitWithRequiredUnits.requiredUnits[0]} is required to be fielded with ${unitWithRequiredUnits.unitName}.`,
				});
			}
		}

		// check that allocated items don't exceed number of units
		currentArmyList?.selectedUnits.map((x) => {
			if (x.attachedItems.length > 0) {
				const magicItems = [
					UpgradeTypes.Magic_Weapon.toString(),
					UpgradeTypes.Magic_Standard.toString(),
					UpgradeTypes.Device_of_Power,
				];
				const currentUnitsItems = x.attachedItems
					.filter((y) => magicItems.includes(y.type))
					.map((x) => x.currentCount);
				const currentUnitItemCounts = currentUnitsItems?.reduce((prev, curr) => prev + curr, 0);
				// flatten num er
				if (currentUnitItemCounts > x.currentCount) {
					errors.push({
						source: "Upgrade",
						sourceName: x.unitName,
						error: `Unit: ${x.currentCount} ${x.unitName} can have a maximum of ${x.currentCount} magic items.`,
					});
				}
			}
		});

		// check unit with army Min count - i.e.,  Generals
		unitsWithArmyMin?.map((u) => {
			const unitExists = currentArmyList?.selectedUnits?.find((x) => x.unitName == u.name);
			if (unitExists) {
				// if count > == u count
				const isValid =
					unitExists.currentCount >= u.armyMin || unitExists.currentCount >= currentArmyPointsLimit * u.min;
				if (!isValid) {
					errors.push({
						source: "Unit",
						sourceName: unitExists.unitName,
						error: `Unit: A minimum of ${u.armyMin ? u.armyMin : currentArmyPointsLimit * u.min} ${
							unitExists.unitName
						}/s in the army is required.`,
					});
				}
			} else {
				errors.push({
					sourceName: u.name,
					error: `Unit: A minimum of ${u.armyMin ? u.armyMin : currentArmyPointsLimit * u.min} ${
						u.name
					}/s in the army is required.`,
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
	const getUnitCounts = () => {
		// ARMY SPECIAL RULE: special rule for bretonnians
		let units = currentArmyList?.selectedUnits.filter((x) => !x.isLeader);
		// filter out noBreak units
		units = units?.filter((x) => !x.ignoreBreakPoint);
		// get total counts
		const totalCounts = units?.map((x) => x.currentCount);
		const sumOfPoints = totalCounts?.reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}, 0);
		let breakCount = sumOfPoints ? Math.round(sumOfPoints / 2) : 0;
		// ARMY SPECIAL RULES
		if (factionDetails?.name == "Nippon") {
			breakCount = breakCount + 1;
		}
		const unitCount = sumOfPoints;
		return `${breakCount}/${unitCount}`;
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
				updateArmyNotes,
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
				getArmyByArmyId,
				getUnitCounts,
			}}
		>
			{children}
		</BuilderContext.Provider>
	);
};

export const useBuilderContext = () => {
	return useContext(BuilderContext);
};
