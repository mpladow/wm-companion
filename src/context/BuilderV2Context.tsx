import { createContext, useCallback, useContext, useEffect, useState, version } from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid-random';
import Constants from 'expo-constants';
import _ from 'lodash';
import { ArmyListPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';
import { useFactionListsV2 } from '@hooks/useArmyList';
import { useFactionDataContext } from './FactionDataContext';

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
  allArmyLists: ArmyListPersistenceType[];
  selectedArmyList?: ArmyListPersistenceType;
  createUserArmyList: (
    faction: number,
    name: string,
    notes: string,
    autopopulate: boolean,
    versionNumber: number
  ) => void;
}

const BuilderV2Context = createContext<BuilderContextInterface>({} as BuilderContextInterface);

export const BuilderV2ContextProvider = ({ children }: any) => {
  //
  // holds the users armies.
  // it will read from the faction data context to grab the data it needs to populate the users list

  // parse the users army list saved in memory
  //

  //   const [userLists, setUserLists] = useState<>()
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

  // const CURRENT_VERSION = 2; // TODO: this should be retrieved by the config
  const { t } = useTranslation(['builder', 'units']);
  const [allArmyLists, setAllArmyLists] = useState<ArmyListPersistenceType[]>([]);
  const [userArmy, setUserArmy] = useState<ArmyListPersistenceType>();
  const { factionDetailsFromApi } = useFactionDataContext();

  useEffect(() => {
    //AsyncStorage.removeItem(`userArmies`);
  }, []);

  const createUserArmyList = (
    faction: number,
    name: string,
    notes: string,
    autopopulate: boolean = true,
    versionNumber: number
  ) => {
    console.log('🚀 ~ BuilderV2ContextProvider ~ newArmy:');

    const newArmy: ArmyListPersistenceType = {
      armyId: uuid(),
      faction: faction,
      name: name,
      isFavourite: false,
      armyNotes: notes,
      order: 0, // todo: get total armies for user, then increment
      selectedUnits: [],
      selectedCharacters: [],
    };
    if (autopopulate) {
      const factionUnits = factionDetailsFromApi?.units.filter(
        (x) => x['min'] != undefined || x['armyMin'] != undefined
      );
      factionUnits?.map((item, index) => {
        // add to newArmy, create a uuid
        let unit: UnitPersistenceType = {
          id: uuid(),
          unitId: item.id,
          name: item.name,
          selectedUpgrades: [],
        };
        newArmy.selectedUnits.push(unit);
      });
      console.log('🚀 ~ BuilderV2ContextProvider ~ created army:', newArmy);
    }
    // add this army to the array of user's armies
  };
  const updateUserArmy = () => {};
  const loadUserArmyById = () => {};

  // PERSISTANCE
  const updateArmyInStorage = () => {
    // update this army in user storage. may happen when the user navigates out of the app.
  };
  const updateUserArmiesInStorage = () => {};
  // load user army from storage

  const loadUserArmiesfromStorage = () => {
    // load all from persistant storage
  };

  return (
    <BuilderV2Context.Provider
      value={{
        allArmyLists,
        selectedArmyList: userArmy,
        createUserArmyList,
      }}>
      {children}
    </BuilderV2Context.Provider>
  );
};

export const useBuilderV2Context = () => {
  return useContext(BuilderV2Context);
};
