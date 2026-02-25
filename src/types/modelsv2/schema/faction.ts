import { MagicSchema } from './magic';
import { SpecialRuleSchema } from './specialrule';
import { CharacterCardSchema, TroopCardSchema } from './unitcard';
import { UpgradeSchema } from './upgrade';

export interface FactionSchema {
	id: number;
	name: string;
	version: number;
	rulesetId: number;
	order: number;
	description: string[]; // an array so it can be set as paragraphs in the UI
	troopCards: TroopCardSchema[];
	characterCards: CharacterCardSchema[];
	preventMagic: boolean;
	allSpecialRules: SpecialRuleSchema[];
	allFactionUpgrades: UpgradeSchema[];
	magic: MagicSchema[];
}