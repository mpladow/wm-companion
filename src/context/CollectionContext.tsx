import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import uuid from "uuid-random";
import { useFactionUnits } from "@utils/useFactionUnits";

export type MiniatureDetailsOverview = {
	unitName: string;
	order: number;
	wishlistCount: number;
	ownedCount: number;
	assembledCount: number;
	paintedCount: number;
	completedCount: number;
};

export type MiniatureDetailsOverviewVM = {
	unitName: string;
	wishlistCount: number;
	ownedCount: number;
	assembledCount: number;
	paintedCount: number;
	completedCount: number;
};
export type CollectionListVM = {
	collectionId: number;
	faction: number;
	miniatureDetails: MiniatureDetailsOverviewVM[];
};
export type CollectionList = {
	collectionId: string;
	faction: number;
	collectionName: string;
	notes?: string;
	miniatureDetails: MiniatureDetailsOverview[];
};

interface ICollectionContext {
	collectionList: CollectionList[];
	updateCollectionName: (collectionName: string, collectionId: string) => Promise<void>;
	updateUnit: (collectionId: string, unit: MiniatureDetailsOverview) => void;
	createCollection: (faction: number, name: string) => Promise<CollectionList>;
	deleteCollection: (collectionId: string) => Promise<void>;
}
const CollectionContext = createContext<ICollectionContext>({} as ICollectionContext);

const USER_COLLECTION = "USER_COLLECTION";
export const CollectionProvider = ({ children }: any) => {
	const [collectionList, setCollectionList] = useState<CollectionList[]>([] as CollectionList[]);
	const { getFactionUnitsByVersion } = useFactionUnits();
	// // HANDLE LOCAL STORAGE MANAGEMENT
	const getCollectionFromStorageAsync = async () => {
		try {
			// get user army lists from storage
			const collection = await AsyncStorage.getItem(USER_COLLECTION);
			if (collection) {
				const collectionObject: CollectionList[] = collection && JSON.parse(collection);
				setCollectionList(collectionObject);
			}
		} catch (e) {}
	};
	const updateStorageAsync = async () => {
		try {
			await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(collectionList));
		} catch (e) {}
	};
	useEffect(() => {
		//setCollectionList(GENERATE_DUMMY_DATA());
		getCollectionFromStorageAsync();
	}, []);
	useEffect(() => {
		// update local storage
		updateStorageAsync();
	}, [collectionList]);

	const updateCollectionName = async (collectionName: string, collectionId: string) => {
		// get collection by collectionId
		console.log(`${collectionName}`);
		setCollectionList(
			produce((draft) => {
				const collectionToUpdate = draft.find((x) => x.collectionId == collectionId);
				if (collectionToUpdate) {
					collectionToUpdate.collectionName = collectionName;
				}
			})
		);
	};
	const updateUnit = (collectionId: string, unit: MiniatureDetailsOverview) => {
		setCollectionList(
			produce((draft) => {
				const index = draft.findIndex((x) => x.collectionId == collectionId);
				if (index !== -1) {
					const miniatureDetailsIndex = draft[index].miniatureDetails.findIndex(
						(y) => y.unitName == unit.unitName
					);
					draft[index].miniatureDetails[miniatureDetailsIndex] = unit;
				}
			})
		);
	};
	const deleteCollection = async (collectionId: string) => {
		setCollectionList((prev) => {
			return prev.filter((c) => c.collectionId != collectionId);
		});
	};
	// UNIT TEST NEEDED
	const createCollection = async (faction: number, name: string) => {
		// create an empty object with every single unit in the faction
		const factionList = getFactionUnitsByVersion(faction, 2);
		const newCollection: CollectionList = {
			collectionId: uuid(),
			faction: faction,
			collectionName: name,
			miniatureDetails: [],
		};
		factionList.factionList?.units.map((u) => {
			let newMiniature: MiniatureDetailsOverview = {
				unitName: u.name,
				order: u.order,
				wishlistCount: 0,
				ownedCount: 0,
				assembledCount: 0,
				paintedCount: 0,
				completedCount: 0,
			};
			newCollection.miniatureDetails.push(newMiniature);
			// set defaultunit details
		});
		// order this list by order
		newCollection.miniatureDetails = newCollection.miniatureDetails.sort((a, b) => (a.order > b.order ? 1 : -1));

		setCollectionList([...collectionList, newCollection]);
		return newCollection;
	};

	return (
		<CollectionContext.Provider
			value={{ collectionList, updateCollectionName, updateUnit, createCollection, deleteCollection }}
		>
			{children}
		</CollectionContext.Provider>
	);
};

export const useCollection = () => {
	return useContext(CollectionContext);
};
