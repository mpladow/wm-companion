import type { Ruleset } from './ruleset';

export interface AlignmentSchema {
	id: number;
	description?: string;
	backgroundImageUrl?: string;
	ruleset: Ruleset
}