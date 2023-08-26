import { SelectedUnitProps } from "@context/BuilderContext";
import { asterixRegex, asterixSingleRegex, underscoreRegex } from "@utils/constants";
import { FactionListProps, UpgradesProps } from "@utils/types";
import reactStringReplace from "react-string-replace";
import magicItemsList from "../../../data/json/wmr/magic-items.json";
import {Text} from "@components/index";
 export const groupByKey = (list, key) => {
	return list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {});
};

export const removeDuplicates = (arr: any[], key: string) => {
	// Create an array of objects
	// filter array by any units that have attached items, if any exist

	// Declare a new array
	let newArray = [];

	// Declare an empty object
	let uniqueObject = {};

	// Loop for the array elements
	for (let i in arr) {
		// Extract the title
		objTitle = arr[i][key];

		// Use the title as the index
		uniqueObject[objTitle] = arr[i];
		console.log(arr[i], "magic item");
	}

	// Loop to push unique object into array
	for (i in uniqueObject) {
		newArray.push(uniqueObject[i]);
	}

	return newArray;
	// Display the unique objects
	console.log(newArray);
};

export const getGroupedList = (arr: SelectedUnitProps[]) => {
	let unitsGrouped = groupByKey(arr, "unitName");

	arr.forEach((u) => {
		// return the unit that holds the attached items array
		const unitCount = unitsGrouped[u.unitName].length;
		console.log(`${u.unitName} count: ${unitCount}`);
		u.currentCount = unitCount;
	});
	const removedDuplicatedUnits = removeDuplicates(arr, "unitName");
	return removedDuplicatedUnits;
};

export const get1000PointInterval = (currentArmyPoints: number) => {
	let currentArmyPointsLimit = Math.floor(currentArmyPoints / 1000);
	if (currentArmyPointsLimit == 0) currentArmyPointsLimit = 1;
	return currentArmyPointsLimit;
};

export const getUpgradeDetailsByName = (upgradeName: string, factionDetails: FactionListProps) => {
	let _upgrades: UpgradesProps | undefined = magicItemsList.upgrades.find((gUp) => gUp.name == upgradeName);
	console.log(_upgrades, '_upgrades')
	if (!_upgrades) {
		_upgrades = factionDetails?.upgrades?.find((fUp) => fUp.name == upgradeName);
	}
	return _upgrades;
};

export const sanitizeText = (text: string, textColor: any) => {
	let cleanText = text;
	console.log(cleanText, 'sanitizeText:: CLEAN TEXXT')
	cleanText = cleanText.replaceAll(",,", '\n');
	cleanText = cleanText.replaceAll("-|-", "<br>")
	cleanText = cleanText.replaceAll("|", '\t')
	// transform content to remove __
	let sanitized = reactStringReplace(cleanText, underscoreRegex, (match, i) => {
		console.log(match, `${match} on ${i}`);
		return (
			<Text bold style={{ color: textColor }} key={i}>
				{match}
			</Text>
		);
	});
	sanitized = reactStringReplace(sanitized, asterixRegex, (match, i) => {
		return (
			<Text italic style={{ color: textColor }} key={i}>
				{match}
			</Text>
		);
	});
	sanitized = reactStringReplace(sanitized, asterixSingleRegex, (match, i) => {
		return (
			<Text italic style={{ color: textColor }} key={i}>
				{match}
			</Text>
		);
	});
	console.log(sanitized, 'conducting sanitixzation');

	return sanitized;
};
