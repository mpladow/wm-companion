
export interface SpecialRuleSchema {
	id: number;
	name:string;
	isGeneric: boolean;
	description: string[];
	version: number;
	order: number;
	/**will be displayed in the header of the army muster list */
	isFactionSpecialRule: boolean;
	/**Will use a key to run custom validation if this rule exists. For now, these custom validation rules will be hardcoded. */
	customRule?: string;
} 