import { get1000PointInterval } from "@navigation/Builder/utils/builderHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { current } from "@reduxjs/toolkit";
import { UpgradeTypes } from "@utils/constants";
import { getGenericSpecialRules } from "@utils/factionHelpers";
import { FactionListProps, UnitProps, UpgradesProps } from "@utils/types";
import { useFactionUnits } from "@utils/useFactionUnits";
import { produce } from "immer";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
	currentCount?: number;
	maxCount?: number;
	armyLimitMaxCount?: number; // hard limit
	addOnUpgrades?: string[];
};
export type SelectedUnitProps = {
	id: string;
	unitName: string;
	order: number;
	points?: number;
	isLeader?: boolean;
	currentCount?: number;
	maxCount?: number;
	minCount?: number;
	ignoreBreakPoint?: boolean;
	attachedItems: SelectedUpgradesProps[];
	requiredUnits?: string[];
};
export type ArmyListProps = {
	versionNumber?: number;
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
	duplicateArmyList: (armyId: string) => void;
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
		armyLimitMaxCount?: number,
		addOnUpgrades?: string[]
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

	const CURRENT_VERSION = 2; // TODO: this should be retrieved by the config
	const { t } = useTranslation(["builder", "units"]);
	const { getFactionUnitsByVersion } = useFactionUnits();

	useEffect(() => {
		//AsyncStorage.removeItem(`userArmies`);
		getScoresFromStorage();
	}, []);

	useEffect(() => {
		// save changes to local storage
		updateStorage();
	}, [userArmyLists]);

	useEffect(() => {
		if (currentArmyList) {
			updateUserArmyLists();
			// update points count
			setArmyErrors(calculateArmyErrors());
		}
	}, [currentArmyList]);

	const setCurrentFaction = (faction: number) => {
		setFaction(faction);
	};

	// // HANDLE LOCAL STORAGE MANAGEMENT
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
	// COMPLETED REFACTOR
	const duplicateArmyList = useCallback((armyId: string) => {
		setUserArmyLists(
			produce((draft) => {
				const armyToDuplicate = draft.find((x) => x.armyId == armyId);
				if (armyToDuplicate) {
					// create new armyId
					const newArmy = Object.assign({}, armyToDuplicate);
					newArmy.armyId = uuid();
					newArmy.name = `${newArmy.name} (copy)`;
					newArmy.armyNotes = "";
					// update unitIds for each nested array
					newArmy.selectedUnits.forEach((u) => {
						u.id = uuid();
						u.attachedItems.forEach((i) => (i.id = uuid()));
					});
					newArmy.selectedUpgrades.forEach((u) => {
						u.id = uuid();
					});
					draft.push(newArmy);
				}
			})
		);
	}, []);
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
		const _factionDetails = getFactionUnitsByVersion(faction, 2);
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

	// COMPLETED REFACTOR
	const updateArmyName = (name: string, armyId: string) => {
		setUserArmyLists(
			produce((draft) => {
				const armyList = draft.find((a) => a.armyId == armyId);
				if (armyList) {
					armyList.name = name;
				}
			})
		);
	};

	// COMPLETED REFACTOR
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

	// COMPLETED REFACTOR
	const deleteUserArmyList = (armyId: string) => {
		setUserArmyLists(
			produce((draft) => {
				const index = draft.findIndex((a) => a.armyId === armyId);
				if (index !== -1) draft.splice(index, 1);
			})
		);
	};

	const setSelectedArmyList = (armyId: string, faction?: number) => {
		// once user selects army, set selectedUnits, name,
		const selectedList = userArmyLists.find((x) => x.armyId == armyId);
		if (selectedList) {
			// get list version
			selectedList.points = calculateCurrentArmyPoints(selectedList);
			const _factionDetails = getFactionUnitsByVersion(selectedList?.faction, CURRENT_VERSION);
			// set faction upgrade tails
			factionDetails && setFactionDetails(_factionDetails.factionList);
			setCurrentArmyList(selectedList);
		} else {
			if (faction) {
				const _factionDetails = getFactionUnitsByVersion(faction, CURRENT_VERSION);
				factionDetails && setFactionDetails(_factionDetails.factionList);
				setCurrentArmyList(selectedList);
			}
		}
	};

	// COMPLETED REFACTOR
	const toggleFavourite = (armyId: string) => {
		setUserArmyLists(
			produce((draft) => {
				const armyToUpdate = draft.find((a) => a.armyId == armyId);
				if (armyToUpdate) {
					armyToUpdate.isFavourite = !armyToUpdate?.isFavourite;
				}
			})
		);
	};

	// COMPLETED REFACTOR
	const updateArmyNotes = (armyId: string, notes: string) => {
		setUserArmyLists(
			produce((draft) => {
				const armyList = draft.find((x) => x.armyId == armyId);
				if (armyList) armyList.armyNotes = notes;
			})
		);
	};
	// COMPLETED REFACTOR
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

		setCurrentArmyList(
			produce((draft) => {
				const unit = draft?.selectedUnits.find((u) => u.unitName == unitName);

				if (unit && unit.currentCount) {
					unit.currentCount = unit.currentCount + 1;
				} else {
					draft?.selectedUnits.push(newUnit);
				}
				// recaculate army points
				if (draft) draft.points = calculateCurrentArmyPoints(draft);
			})
		);
	};
	// COMPLETED REFACTOR
	const removeUnit = (unitId: string) => {
		setCurrentArmyList(
			produce((draft) => {
				const unit = draft?.selectedUnits.find((u) => u.id == unitId);
				if (unit && unit.currentCount) {
					if (unit.currentCount > 1) {
						unit.currentCount = unit.currentCount - 1;
					} else {
						if (draft) {
							draft.selectedUnits = draft?.selectedUnits.filter((u) => u.id !== unitId);
						}
					}
				}
				// recaculate army points
				if (draft) draft.points = calculateCurrentArmyPoints(draft);
			})
		);
	};

	// COMPLETED REFACTOR
	const addItem = (
		unitName: string,
		type: string,
		points: number,
		itemName: string,
		maxCount?: number,
		armyLimitMaxCount?: number,
		addOnUpgrades?: string[]
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
			addOnUpgrades: addOnUpgrades,
		};

		setCurrentArmyList(
			produce((draft) => {
				if (draft) {
					// add to army selected upgrades
					draft?.selectedUpgrades.push(newUpgrade);
					// add to unit
					const unit = draft?.selectedUnits.find((u) => u.unitName == unitName);
					if (unit) {
						// find upgrade if one exists.
						const unitHasUpgrade = unit.attachedItems.find((x) => x.upgradeName == itemName);
						if (unitHasUpgrade && unitHasUpgrade.currentCount) {
							unitHasUpgrade.currentCount = unitHasUpgrade.currentCount + 1;
						} else {
							// add new item to unit
							unit.attachedItems.push(newUpgrade);
						}
					}
					// upgrade army points
					draft.points = calculateCurrentArmyPoints(draft);
				}
			})
		);
	};
	// COMPLETED REFACTOR
	const removeItem = (unitName: string, upgradeId: string) => {
		setCurrentArmyList(
			produce((draft) => {
				if (draft) {
					const unit = draft?.selectedUnits.find((u) => u.unitName == unitName);
					if (unit) {
						const unitUpgrade = unit?.attachedItems.find((x) => x.id == upgradeId);
						if (!unitUpgrade || !unitUpgrade.currentCount) return;
						if (unitUpgrade && unitUpgrade.currentCount > 1) {
							// reduce count
							unitUpgrade.currentCount = unitUpgrade.currentCount - 1;
						} else {
							// splice from array
							unit.attachedItems = unit.attachedItems.filter((i) => i.id != upgradeId);
						}
						// REFECTOR THE BELOW
						const armyUpgradeIndex = draft?.selectedUpgrades?.findIndex(
							(x) => x.upgradeName == unitUpgrade?.upgradeName
						);

						if (armyUpgradeIndex > -1) draft?.selectedUpgrades?.splice(armyUpgradeIndex, 1);

						// recaculate army points
						draft.points = calculateCurrentArmyPoints(draft);
					}
				}
			})
		);
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
		currentArmyList?.points;
		return arrayOfPoints;
	};

	const calculateArmyErrors = () => {
		const POINTS_LEEWAY = 5;
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
						error: `${t("MaximumItemsInArmyReached", {
							maxCount: selectedUpgrade.armyLimitMaxCount,
							item: selectedUpgrade.upgradeName,
						})}`,
					});
				}
			}
			if (selectedUpgrade && selectedUpgrade?.maxCount != undefined) {
				const maxCountPer1000 = currentArmyPointsLimit * selectedUpgrade.maxCount;
				if (count > maxCountPer1000) {
					errors.push({
						source: "Upgrade",
						sourceName: selectedUpgrade.upgradeName,
						error: `${t("MaximumItemsPer1000", {
							maxCount: selectedUpgrade.maxCount,
							item: selectedUpgrade.upgradeName,
						})}`,
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
							error: `${t("MaxMountsReached", { unit: cu.unitName })}`,
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
					error: `${t("ErrorRequiredUnit", {
						requiredUnit: unitWithRequiredUnits.requiredUnits[0],
						targetUnit: unitWithRequiredUnits.unitName,
					})}`,
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
						error: `${t("MinimumUnitsRequired", {
							minCount: u.armyMin ? u.armyMin : currentArmyPointsLimit * u.min,
							unit: unitExists.unitName,
						})}`,
					});
				}
			} else {
				errors.push({
					sourceName: u.name,
					error: `${t("MinimumUnitsRequired", {
						minCount: u.armyMin ? u.armyMin : currentArmyPointsLimit * u.min,
						unit: u.name,
					})}`,
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
						error: `${t("MaximumUnitsInArmyReached", { maxCount: u.armyMax, unit: unitExists.unitName })}`,
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
						error: `${t("MaximumUnitsPer1000", { maxCount: unit.maxCount, unit: unit.unitName })}`,
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
				duplicateArmyList,
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
