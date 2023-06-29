import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeOptions = "light" | "dark";
interface ThemeContextInterface {
	theme: ThemeOptions;
	setTheme: React.Dispatch<React.SetStateAction<ThemeOptions>>;
}



// init context
export const ThemeContext = createContext<ThemeContextInterface | null>(null);

// create provider
export const ThemeContextProvider = ({ children }: any) => {
	// default theme for device
	const [theme, setTheme] = useState<ThemeOptions>("dark");

	// fetch theme from local storage
	useEffect(() => {
		const storedTheme = async () => {
			const currentTheme = await AsyncStorage.getItem("theme");
			return currentTheme;
		};
		storedTheme().then((currentTheme) => {
			if (currentTheme == "dark" || currentTheme == "light") {
				setTheme(currentTheme);
			}
		});
	}, []);

	useEffect(() => {
		AsyncStorage.setItem("theme", theme);
	}, [theme]);
	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};


