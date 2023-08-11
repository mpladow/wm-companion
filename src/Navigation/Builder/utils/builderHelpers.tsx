import { SelectedUnitProps } from "@context/BuilderContext";

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
		console.log(arr[i],'magic item')
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
    return removedDuplicatedUnits
};
