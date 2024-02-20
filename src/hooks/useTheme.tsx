import { ThemeContext } from "@context/ThemeContext";
import { Dispatch, SetStateAction, useContext } from "react";

export interface Theme {
	background: string;
	backgroundVariant: string;
	backgroundVariant2: string;
	text: string;
	textInverted: string;
	variant: string;
	secondary: string;
	secondaryVariant: string;
	accent: string;
	success: string;
	warning: string;
	error: string;
	black: string;
	white: string;
	disabled: string;
	grey: string;
	grey2: string;
	grey3: string;
	danger: string;
	blueGrey: string;
	darkRed: string;
	orange: string;
	yellow: string;
	lightGreen3: string;
	darkGreen4: string;
}
const darkColours = {
	DARK_GREEN: "#588157", //dark green
	LIGHT_GREEN: "#80ed99", //light brown
	LIGHT_GREEN2: "#BDE4A8", // light green
	DARK_GREEN_2: "#344e41", // darkgreen
	DARK_BROWN_2: "#6c584c", // dark brown
	DARK_BLUE: "#00798C",
	WHITE: "#ffffff",
	DARK_BLUE_3: "#14213d",
	RED: "#E14919",
	YELLO: "#F8D33F",
	BLACK: "#000000",
	GREY1: "#6c757d",
	GREY2: "#586994",
	GREY3: "#2B2D42",
	BLUEGREY: "#153243",
	DARKRED: "#8f1b0e",
	ORANGE: "#e36052",
	YELLOW: "#877c03",
	LIGHT_GREEN3: "#71c924",
	DARK_GREEN4: "#017a19",
};
const darkTheme: Theme = {
	background: darkColours.DARK_GREEN_2,
	backgroundVariant: darkColours.BLUEGREY,
	backgroundVariant2: darkColours.BLACK,
	text: darkColours.WHITE,
	textInverted: darkColours.BLACK,
	variant: darkColours.DARK_BLUE_3,
	secondary: darkColours.DARK_GREEN,
	secondaryVariant: darkColours.LIGHT_GREEN,
	accent: darkColours.LIGHT_GREEN,
	success: darkColours.DARK_BLUE,
	warning: darkColours.YELLO,
	error: darkColours.RED,
	black: darkColours.BLACK,
	white: darkColours.WHITE,
	disabled: darkColours.GREY1,
	grey: darkColours.GREY2,
	grey2: darkColours.GREY2,
	grey3: darkColours.GREY3,
	danger: darkColours.RED,
	blueGrey: darkColours.BLUEGREY,
	darkRed: darkColours.DARKRED,
	orange: darkColours.ORANGE,
	yellow: darkColours.YELLOW,
	lightGreen3: darkColours.LIGHT_GREEN3,
	darkGreen4: darkColours.DARK_GREEN4

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
