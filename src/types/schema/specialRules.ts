export type GenericRules = {
	id: number,
	/**The name of the special rule */
	name: string,
	description: string[]
}
export type FactionSpecialRules = {
	id: string,
	name: string;
	order: number,
	description: string[]
}