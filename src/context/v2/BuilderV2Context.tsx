import { createContext, useCallback, useContext, useEffect, useState, version } from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid-random';
import Constants from 'expo-constants';
import _ from 'lodash';
import { ArmyListPersistenceType, CharacterPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';
import { useFactionListsV2 } from '@hooks/useFactionLists';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ARMIES } from 'src/constants/persistenceKeys';
import { current, produce } from 'immer';
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
  allUserArmies: ArmyListPersistenceType[];
  selectedArmyList?: ArmyListPersistenceType;
  createUserArmyList: (
    faction: number,
    name: string,
    notes: string,
    autopopulate: boolean,
    versionNumber: number,
    /**Manually Updates the users army and saves into memory storage */
  ) => ArmyListPersistenceType;
  updateUserArmy: () => void;
  getArmyById: (id: string) => ArmyListPersistenceType | undefined;
  deleteArmyById: (id: string) => void;
  handleSetFocusedArmyByArmyId: (id: string) => Promise<boolean>;
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
  const [allUserArmies, setAllUserArmies] = useState<ArmyListPersistenceType[]>([]);
  const [selectedUserArmy, setSelectedUserArmy] = useState<ArmyListPersistenceType>();
  const { factionDetailsFromApi } = useFactionDataContext();

  useEffect(() => {
    //AsyncStorage.removeItem(`userArmies`);
  }, []);

  const createUserArmyList = (
    faction: number,
    name: string,
    notes: string,
    autopopulate: boolean = true,
    versionNumber: number,
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
        (x) => x['min'] != undefined || x['armyMin'] != undefined,
      );
      factionUnits?.map((item, index) => {
        // add to newArmy, create a uuid
        // iterate over the number of units to add
        const minValueToUse = item['min'] ?? item['armyMin'] ?? 1;
        for (let index = 0; index < minValueToUse; index++) {
          let unit: UnitPersistenceType = {
            id: uuid(),
            unitId: item.id,
            name: item.name,
            order: index,
            selectedUpgrades: [],
          };
          newArmy.selectedUnits.push(unit);
        }
      });
      // get min characters
      const characterUnits = factionDetailsFromApi?.characters.filter((x) => x['armyMin'] != undefined);
      characterUnits?.map((item, index) => {
        // add to newArmy, create a uuid
        let unit: CharacterPersistenceType = {
          id: uuid(),
          characterId: item.id,
          name: item.name,
          order: index,
          selectedUpgrades: [],
        };
        newArmy.selectedCharacters.push(unit);
      });
      setAllUserArmies((old) => [...old, newArmy]);
      return newArmy;
    }
    // add this army to the array of user's armies
  };

  /**On load, load all user armies from storage */
  useEffect(() => {
    loadUserArmiesfromStorage();
  }, []);

  // update storage when allUserArmies changes
  useEffect(() => {
    updateUserArmiesInStorage();
  }, [allUserArmies]);

  const updateUserArmy = () => {
    // update the user army.
    if (selectedUserArmy) {
      const armyListToUpdateIndex = allUserArmies.findIndex((x) => x.armyId == selectedUserArmy?.armyId);
      setAllUserArmies((prev) => {
        const updatedSelectedUnits = [
          ...prev.slice(0, armyListToUpdateIndex),
          selectedUserArmy,
          ...prev.slice(armyListToUpdateIndex + 1),
        ];
        return updatedSelectedUnits;
      });
    }
    // then update this specific army
  };
  const getArmyById = (id: string) => {
    // find the users army by id
    const found = allUserArmies.find((x) => x.armyId == id);
    setSelectedUserArmy(found);
    return found;
  };

  const deleteArmyById = (id: string) => {
    setAllUserArmies(
      produce((draft) => {
        const index = draft.findIndex((a) => a.armyId === id);
        if (index !== -1) draft.splice(index, 1);
      }),
    );
  };

  // PERSISTANCE
  const updateUserArmiesInStorage = () => {
    if (allUserArmies) {
      console.log('🚀 ~ updateStorage ~ allUserArmies:', allUserArmies);
      const updateStorage = async () => {
        try {
          await AsyncStorage.setItem(USER_ARMIES, JSON.stringify(allUserArmies));
        } catch (e) {}
      };
      updateStorage();
    }
  };
  // load user army from storage

  const loadUserArmiesfromStorage = () => {
    // load all from persistant storage
    const getArmiesFromStorage = async () => {
      try {
        const armiesRaw = await AsyncStorage.getItem(USER_ARMIES);
        const userArmies: ArmyListPersistenceType[] = armiesRaw && JSON.parse(armiesRaw);
        if (userArmies) {
          setAllUserArmies(userArmies);
        } else {
          setAllUserArmies([]);
        }
      } catch (e) {
        console.error(e, 'Error');
      }
    };
    getArmiesFromStorage();
  };

  const handleSetFocusedArmyByArmyId = async (id: string) => {
    // find the army and then set this as the focused army
    const army = allUserArmies.find((x) => x.armyId == id);
    console.log('🚀 ~ handleSetFocusedArmyByArmyId ~ army:', army);
    setSelectedUserArmy(army);
    return army;
  };

  return (
    <BuilderV2Context.Provider
      value={{
        allUserArmies,
        selectedArmyList: selectedUserArmy,
        createUserArmyList,
        updateUserArmy,
        getArmyById,
        deleteArmyById,
        handleSetFocusedArmyByArmyId,
      }}>
      {children}
    </BuilderV2Context.Provider>
  );
};

export const useBuilderV2Context = () => {
  return useContext(BuilderV2Context);
};
