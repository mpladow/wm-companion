import { useChangeLogs } from "@hooks/getChangelogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createContext, useContext, useEffect, useState } from "react";
import { CHANGE_LOG_DISMISSED } from "src/constants/persistenceKeys";
import { ChangeLog } from "src/types/data/changelog";

type UpdateCheckerContextType = {
	changelog?: ChangeLog;
	recentlyDismissedChangeLog?: string;
	dismissChangeLog: () => void;
	clearDismissedDEBUG: () => void;
	isReady: boolean;
};

const UpdateCheckerContext = createContext<UpdateCheckerContextType>({} as UpdateCheckerContextType);

export const UpdateCheckerContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [recentlyDismissedChangeLog, setRecentlyDismissedChangeLog] = useState<string>();
	const [changelog, setChangelog] = useState<ChangeLog | undefined>();
	const { getChangeLogsByVersion } = useChangeLogs();
	const [isReady, setIsReady] = useState(false);
	const version = Constants.expoConfig?.version;

	// on load, check local storage for whether changelog has already been dismissed
	useEffect(() => {
		setIsReady(false);

		getStorageItems();
	}, [version]);

	const getStorageItems = async () => {
		if (version) {
			await AsyncStorage.getItem(CHANGE_LOG_DISMISSED).then((res) => {
				if (res) {
					const resObj = JSON.parse(res);
					setRecentlyDismissedChangeLog(resObj);
				}
				const currentChangeLog = getChangeLogsByVersion(version);
				if (currentChangeLog) {
					console.log("---CHANGELOG FOUND");
				} else {
					console.log("---NO CHANGELOG FOUND");
				}
				setChangelog(currentChangeLog);
				setIsReady(true);
			});
		}
	};

	// if dismissed is false AND current version has a change log, then show cl
	const dismissChangeLog = () => {
		console.log(`setting ${CHANGE_LOG_DISMISSED} to ${version}`);
		AsyncStorage.setItem(CHANGE_LOG_DISMISSED, JSON.stringify(version));
		setRecentlyDismissedChangeLog(version);
	};

	const clearDismissedDEBUG = () => {
		AsyncStorage.removeItem(CHANGE_LOG_DISMISSED);
	};
	// if dismissed is true AND current version has a change

	// -- if no, then check current current version with changelogs.
	// if one exists that matches the current version, then set ChangeLog.

	return (
		<UpdateCheckerContext.Provider
			value={{ isReady, changelog, recentlyDismissedChangeLog, dismissChangeLog, clearDismissedDEBUG }}
		>
			{children}
		</UpdateCheckerContext.Provider>
	);
};

export const useUpdateChecker = () => {
	const context = useContext(UpdateCheckerContext);
	if (context === undefined) {
		throw new Error("useUpdateChecker must be within UpdateCheckerProvider");
	}
	return context;
};
