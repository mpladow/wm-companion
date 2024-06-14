// TODO: move to seperate file
export type ChangeLog = {
	version: string;
	changes: Change[];
};

export type Change = {
	type: "bug" | "overhaul" | "improvement";
	title: string;
	description: string[];
};
