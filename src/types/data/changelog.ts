// TODO: move to seperate file
export type ChangeLog = {
	version: string;
	changes: Change[];
};

export type ChangeLogImage = {
	source: "gotrek_felix_01.png";
	accessibilityLabel?: string;
	placement?: "top" | "bottom";
};

export type Change = {
	type: "bug" | "overhaul" | "improvement";
	title: string;
	description: string[];
	images?: ChangeLogImage[];
};
