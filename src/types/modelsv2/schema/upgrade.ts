
export interface UpgradeSchema {
	order: number;
	description?: string[]; // sometimes the description of the upgrqde will be available in the allFactionspecial rules descriptions
	replacesUnitName?: boolean;
	availableToUnits?: string[];
	availableToUnitTypes?: string[];
	armyMax?: number;
	points: UpgradePointsSchema;

}

export interface UpgradeConstraintSchema {
	availableForUnitTypes: string[];
	upgradeNames: string[];
}
export interface UpgradePointsSchema {
	defaultPoints?: number;
	/**eg looks at target unit armour value */
	variableStat?: string;
	/** checks what the value of the variable stat is, and then assigns points based on the value */
	variablePoints?: Record<string, number>;
}