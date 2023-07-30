import { DropDownItemProps } from "@navigation/Home/screens/Home";
import { Factions } from "@utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

interface FactionContextInterface {
	factionList?: any;
	factionsDd: DropDownItemProps[];
}

const FactionContext = createContext<FactionContextInterface>({} as FactionContextInterface);

export const FactionContextProvider = ({ children }: any) => {
	const [factionsDD, setFactionsDD] = useState([] as DropDownItemProps[]);
	useEffect(() => {
		// get list of factions
		const factions = Object.keys(Factions);
		const dropdownList = factions.map(
			(x, index) => ({ label: x.replace("_", " "), value: index + 1 } as DropDownItemProps)
		);
		setFactionsDD(dropdownList);
	}, []);
	return <FactionContext.Provider value={{ factionsDd: factionsDD }}>{children}</FactionContext.Provider>;
};

export const useFactionsContext = () => {
	return useContext(FactionContext);
};
