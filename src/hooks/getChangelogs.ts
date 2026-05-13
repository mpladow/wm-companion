import { ChangeLog } from "src/types/data/changelog";
import change1_2_36 from "../data/changelogs/2024/1_2_36.json";
import change1_2_37 from "../data/changelogs/2024/1_2_37.json";
import change1_2_38 from "../data/changelogs/2024/1_2_38.json";
import change1_2_39 from "../data/changelogs/2026/1_2_39.json";
import change1_2_40 from "../data/changelogs/2026/1_2_40.json";
import change1_2_41 from "../data/changelogs/2026/1_2_41.json";

export const ChangeLogs: ChangeLog[] = [change1_2_36 as ChangeLog, change1_2_37 as ChangeLog, change1_2_38 as ChangeLog, change1_2_39 as ChangeLog, change1_2_40 as ChangeLog, change1_2_41 as ChangeLog];

export const useChangeLogs = () => {
	const getChangeLogsByVersion = (version: string) => {
		console.log("🚀 ~ getChangeLogsByVersion ~ version:", version)
		// get change logs
		const changeLogFound = ChangeLogs.find((x) => x.version === version);
		return changeLogFound;
	};

	return { getChangeLogsByVersion };
};
