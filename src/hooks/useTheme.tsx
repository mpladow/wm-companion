import { ThemeContext } from "@context/ThemeContext";
import { Dispatch, SetStateAction, useContext } from "react";

export interface Theme {
	background: string;
	backgroundVariant: string;
    backgroundVariant2: string;
	text: string;
	variant: string;
	secondary: string;
	secondaryVariant: string;
	accent: string;
	success: string;
	warning: string;
	error: string;
    black: string;
    disabled: string;
}
const darkColours = {
	DARK_GREEN: "#588157", //dark green
	LIGHT_GREEN: "#80ed99", //light brown
	DARK_GREEN_2: "#344e41", // darkgreen
	DARK_BROWN_2: "#6c584c", // dark brown
	WHITE: "#ffffff",
	DARK_BLUE_3: "#14213d",
	RED: "#d90429",
	YELLO: "#fca311",
    BLACK: "#000000",
    GREY1: "#6c757d"
};
const darkTheme: Theme = {
	background: darkColours.DARK_GREEN_2,
	backgroundVariant: darkColours.DARK_BROWN_2,
    backgroundVariant2: darkColours.BLACK,
	text: darkColours.WHITE,
	variant: darkColours.DARK_BLUE_3,
	secondary: darkColours.DARK_GREEN,
	secondaryVariant: darkColours.LIGHT_GREEN,
	accent: darkColours.LIGHT_GREEN,
	success: darkColours.LIGHT_GREEN,
	warning: darkColours.YELLO,
	error: darkColours.RED,
    black: darkColours.BLACK,
    disabled: darkColours.GREY1
};

interface UseThemeHook {
	theme: Theme;
	setTheme: Dispatch<SetStateAction<"light" | "dark">>;
}
export const useTheme = (): UseThemeHook => {
	const { theme, setTheme } = useContext(ThemeContext)!;

	if (theme === "dark") {
		return {
			theme: darkTheme,
			setTheme,
		};
	}

	return {
		theme: darkTheme,
		setTheme,
	};
};
