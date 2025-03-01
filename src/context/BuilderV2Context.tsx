import { get1000PointInterval } from '@navigation/Builder/utils/builderHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpgradeTypes } from '@utils/constants';
import { FactionListProps, UpgradesProps } from '@utils/types';
import { useFactionUnits } from '@utils/useFactionUnits';
import { current, produce } from 'immer';
import { createContext, useCallback, useContext, useEffect, useState, version } from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid-random';
import Constants from 'expo-constants';
import _ from 'lodash';
import magicItemsList from '../data/json/wmr/magic-items.json';
import { FactionDto } from 'src/types/schema/faction';
import { AllSpecialRulesType, FactionType } from 'src/types/models/types';

export type ArmyListFilters = 'old' | 'losers' | 'all';
export type ListSections = 'favourites' | 'main';
type ArmyErrorsProps = {
  source?: 'Unit' | 'Upgrade';
  sourceName: string;
  error: string;
};
export type SelectedUpgradesProps = {
  id: string;
  upgradeName: string;
  type: string;
  attachedToName: string; // the name of the unit this item is attached to
  points: number;
  currentCount?: number;
  maxCount?: number;
  armyLimitMaxCount?: number; // hard limit
  addOnUpgrades?: string[];
};
export type SelectedUnitProps = {
  id: string;
  unitName: string;
  order: number;
  points?: number;
  isLeader?: boolean;
  currentCount?: number;
  maxCount?: number;
  minCount?: number;
  ignoreBreakPoint?: boolean;
  attachedItems: SelectedUpgradesProps[];
  requiredUnits?: string[];
};
export type ArmyListProps = {
  versionNumber?: number;
  armyId: string;
  faction: number;
  name: string;
  isFavourite: boolean;
  armyNotes: string;
  order: number;
  selectedUnits: SelectedUnitProps[];
  selectedUpgrades: SelectedUpgradesProps[];
  points: number;
};
interface BuilderContextInterface {
  userArmyLists: ArmyListProps[];
  getUserArmyLists: (filters?: ArmyListFilters[]) => ArmyListProps[];
  addUserArmyList: (
    faction: number,
    name: string,
    autopopulate: boolean,
    versionNumber: number
  ) => Promise<string>;
  deleteUserArmyList: (armyId: string) => void;
  duplicateArmyList: (armyId: string) => void;
  migrateArmyList: (armyId: string, versionNumber: number) => void;

  setSelectedArmyList: (armyId: string) => void;
  selectedArmyList?: ArmyListProps;
  //armyName: string;
  updateArmyName: (name: string, armyId: string) => void;
  toggleFavourite: (armyId: string) => void;
  updateArmyNotes: (armyId: string, notes: string) => void;
  addUnit: (
    unitName: string,
    points?: number,
    isLeader?: boolean,
    maxCount?: number,
    minCount?: number,
    ignoreBreakPoint?: boolean
  ) => void;
  removeUnit: (unitId: string) => void;
  addItem: (
    unitName: string,
    type: string,
    points: number,
    magicItemName: string,
    maxCount?: number,
    armyLimitMaxCount?: number,
    addOnUpgrades?: string[]
  ) => void;
  removeItem: (unitName: string, upgradeId: string) => void;
  updateUserArmyLists: () => void;
  setCurrentFaction: (faction: number) => void;
  currentFaction?: number;
  calculateCurrentArmyPoints: () => number;
  factionDetails?: FactionListProps;
  armyErrors: ArmyErrorsProps[];
  getArmyByArmyId: (armyId: string) => ArmyListProps | undefined;
  getUnitCounts: () => string;
  getMagicItemsForUnit: (unitName: string) => any[];
}

const BuilderContext = createContext<BuilderContextInterface>({} as BuilderContextInterface);

export const BuilderV2ContextProvider = ({ children }: any) => {
  //
  // holds the users armies.
  // it will read from the faction data context to grab the data it needs to populate the users list

  // parse the users army list saved in memory
  //
    useState<AllSpecialRulesType[]>();

  const [userLists, setUserLists] = useState<>()
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

  // const CURRENT_VERSION = 2; // TODO: this should be retrieved by the config
  const { t } = useTranslation(['builder', 'units']);

  useEffect(() => {
    //AsyncStorage.removeItem(`userArmies`);
  }, []);

  useEffect(() => {
    // save changes to local storage
    updateStorage();
  }, [userArmyLists]);

  return (
    <BuilderContext.Provider
      value={{
        selectedArmyList: currentArmyList,

        currentFaction: faction,
      }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
