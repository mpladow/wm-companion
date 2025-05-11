import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ArmyListPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';
import { useFactionDataContext } from './FactionDataContext';
import { useBuilderV2Context } from './BuilderV2Context';
import { ArmyListType } from 'src/types/models/types';
import { useFactionListsV2 } from '@hooks/useFactionLists';
import { ArmyListVM, UnitDetailsVM } from 'src/types/models/viewModel';
import { getKeyByValue } from '@utils/factionHelpers';
import { Factions } from '@utils/constants';

type BuilderEditorContextType = {
  currentArmyVM?: ArmyListVM;
  currentArmy?: ArmyListPersistenceType;
  addUnitByUnitId?: (unitId: string) => void;
  addItemToUnit?: (unitId: string, itemId: string) => void;
  copyUnit?: (id: string) => void;
  deleteUnit?: (id: string) => void;
  setupBuilderEditor: (armyId: string) => void;
};

const BuilderEditorContext = createContext<BuilderEditorContextType>({} as BuilderEditorContextType);

export const BuilderEditorProvider = ({ children }: PropsWithChildren) => {
  const [currentArmyVM, setCurrentArmyVM] = useState<ArmyListVM>();
  const [currentArmy, setCurrentArmy] = useState<ArmyListPersistenceType>();

  const { allUserArmies, getArmyById, deleteArmyById, selectedArmyList, handleSetFocusedArmyByArmyId } =
    useBuilderV2Context();
  const { factionDetailsFromApi } = useFactionListsV2(currentArmy?.faction);

  const setupBuilderEditor = (armyId: string) => {
    const army = getArmyById(armyId);
    if (army) {
      setCurrentArmy(army);
    }
  };

  useEffect(() => {
    if (factionDetailsFromApi && currentArmy) {
      if (currentArmy) {
        const army: ArmyListVM = {
          armyId: currentArmy?.armyId,
          name: currentArmy?.name,
          isFavourite: false,
          armyNotes: currentArmy?.armyNotes,
          order: currentArmy?.order,
          selectedUnits: [],
          selectedCharacters: [],
          points: 0,
          faction: getKeyByValue(Factions, currentArmy.faction ?? 'Not FOund')?.toString(),
        };
        currentArmy?.selectedUnits.map((x) => {
          const unitDetailsFromApi = factionDetailsFromApi?.units.find((unit) => unit.id == x.unitId);
          if (unitDetailsFromApi) {
            const unit: UnitDetailsVM = {
              id: x.id,
              unitId: x.unitId,
              name: x.name,
              order: x.order,
              type: unitDetailsFromApi.type,
              attack: unitDetailsFromApi.attack,
              rangeAttack: unitDetailsFromApi.rangeAttack,
              range: unitDetailsFromApi.range,
              hits: unitDetailsFromApi.hits,
              size: unitDetailsFromApi.size,
              totalPoints: 0,
              selectedUpgrades: [],
            };
            // check for upgrades
            if (x.selectedUpgrades.length > 0) {
              // set vm for upgrades
            }
            army.selectedUnits.push(unit);
          }
        });
        setCurrentArmyVM(army);
      } // populate a vm for all the user details
    }
  }, [factionDetailsFromApi, currentArmy]);

  // current army
  // add units
  // delete units
  // copy units
  // exporter
  return (
    <BuilderEditorContext.Provider value={{ currentArmyVM, currentArmy, setupBuilderEditor }}>
      {children}
    </BuilderEditorContext.Provider>
  );
};

export const useBuilderEditorV2 = (armyId?: string) => {
  const context = useContext(BuilderEditorContext);
  if (!context) {
    throw new Error('Unable to use useBuilderEditor');
  } else {
    if (armyId) {
      context?.setupBuilderEditor(armyId);
    }
    return context;
  }
};
