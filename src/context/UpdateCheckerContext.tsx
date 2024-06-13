import { useChangeLogs } from "@hooks/getChangelogs";
import { createContext, useContext, useEffect, useState } from "react";
import Constants from "expo-constants";
import { ChangeLog } from "src/types/data/changelog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHANGE_LOG_DISMISSED } from "src/constants/persistenceKeys";
import { current } from "immer";

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
		console.log("🚀 ~ useEffect ~ getStorageItems:");

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

	// useEffect(() => {
	// 	console.log("🚀 ~ useEffect ~ changelog:", changelog);
	// 	if (changelog) {
	// 		getRecentCLDismissed().then((res) => {
	// 			console.log("🚀 ~ getRecentCLDismissed ~ res:", res);
	// 			if (res) {
	// 				const resObj = JSON.parse(res);
	// 				setChangelogDismissed(resObj);
	// 			}
	// 			const currentCLVersion = changelog?.version;
	// 			const currentLogDismissed = currentCLVersion !== res;
	// 			console.log("🚀 ~ getRecentCLDismissed ~ currentCLVersion:", currentCLVersion);
	// 			console.log("🚀 ~ getRecentCLDismissed ~ res:", res);
	// 			setShowChangeLog(currentLogDismissed);
	// 		});
	// 	}
	// }, [changelog]);

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
