export interface UserList {
	UserListId: string;
	IsFavourite: boolean;
	// RulesetId: number;
	Name: string;
	Notes: string;
	CreatedAt: Date;
	FactionId: number;
	UnitCards: PersistenceUnitCard[];
	Order: number;
	// indicates the version number for the ruleset this list is assoicated with. If there is a mismatch between the current ruleset version number and the version number of the list, then the user should be warned that their list may be out of date and should be reviewed for any necessary updates.
	VersionNumber: number;
	CustomImageUrl?: string;
}

export interface PersistenceUnitCard {
	PersistenceUnitCardId: string;
	UnitId: number;
	UpgradeIds: number[];
	CreatedAt: Date;
}