import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { FactionDto } from 'src/types/schema/faction';
import { AllSpecialRulesType, FactionType } from 'src/types/models/types';
import empireList from '../data/json/wmr/v3/empire.json';
import albionList from '../data/json/wmr/v3/albion.json';

import genericRules from '../data/json/wmr/v3/GenericRules/genericRules.json';
import { Factions } from '@utils/constants';
import { SpecialRulesType } from 'src/types/data/army';

type FactionContextType = {
  allFactionData: FactionType[];
  selectedFactionData?: FactionType;
  setSelectedFactionByFactionId: (factionId: number) => void;
};

export const FactionContext = createContext<FactionContextType>({} as FactionContextType);

export const FactionProvider = ({ children }: PropsWithChildren) => {
  /// this is the raw faction data we transform from the local data
  const [allFactionData, setAllFactionData] = useState<FactionType[]>([]);

  const [selectedFactionData, setSelectedFactionData] = useState<FactionType>();

  useEffect(() => {
    const allArmies = [empireList as FactionDto, albionList as FactionDto];
    const genericRulesTyped = genericRules as AllSpecialRulesType[];
    const allArmiesType = allArmies.map((a) => {
      const armyDataType: FactionType = {
        name: a?.name,
        version: a.version,
        order: a.order,
        description: a.description,
        units: a.units,
        characters: a.characters,
        allSpecialRules: (a.factionSpecialRules as AllSpecialRulesType[]) ?? [],
        spells: a.spells,
        magic: false,
        factionId: a.id,
        factionName: a.name,
      };
      // set generic special rules to faction details
      const additionalGenericRules = armyDataType.units
        .flatMap((x) => {
          const foundSpecialRule = genericRulesTyped.find((r) => r.name == x.name);
          if (foundSpecialRule) {
            return foundSpecialRule;
          }
        })
        .filter((x) => x !== undefined);
      armyDataType.allSpecialRules.push(...additionalGenericRules);
      return armyDataType;
    });
    setAllFactionData(allArmiesType);
  }, []);

  const setSelectedFactionByFactionId = useCallback(
    (factionId: number) => {
      const factionDataFound = allFactionData?.find((x) => x.factionId == factionId);
      if (factionDataFound) {
        setSelectedFactionData(factionDataFound);
      }
      return factionDataFound;
    },
    [allFactionData]
  );

  return (
    <FactionContext.Provider value={{ allFactionData, selectedFactionData, setSelectedFactionByFactionId }}>
      {children}
    </FactionContext.Provider>
  );
};

export const useFactionDataContext = () => {
  let context = useContext(FactionContext);
  if (context == null) {
    throw new Error('NO CONTEXT EXISTS');
  }
  return context;
};
