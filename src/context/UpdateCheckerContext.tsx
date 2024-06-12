import { createContext, useContext, useState } from "react";

type UpdateCheckerContextType = {
	changelogDismissed: boolean;
	showChangeLog: boolean;
	changelog?: ChangeLog;
};

// TODO: move to seperate file
export type ChangeLog = {
	versionNumber: number;
	changes: Change[];
};
export type Change = {
	type: "bug" | "overhaul" | "improvement";
	title: string;
	description: string[];
};
const UpdateCheckerContext = createContext<UpdateCheckerContextType>({} as UpdateCheckerContextType);

export const UpdateCheckerContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [changelogDismissed, setChangelogDismissed] = useState(false);
	const [showChangeLog, setShowChangeLog] = useState(false);
	const [changelog, setChangelog] = useState<ChangeLog | undefined>();

	// on load, check local storage for whether changelog has already been dismissed
	// -- if no, then check current current version with changelogs.
	// if one exists that matches the current version, then set ChangeLog.

	return (
		<UpdateCheckerContext.Provider value={{ changelogDismissed, showChangeLog, changelog }}>
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
