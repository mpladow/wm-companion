import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FactionDto } from 'src/types/schema/faction';
import { AllSpecialRulesType, CharacterType, FactionType, UnitDetailsType, UpgradeType } from 'src/types/models/types';
import empireList from '../data/json/wmr/v3/empire.json';
import albionList from '../data/json/wmr/v3/albion.json';
import magicItemsList from '../data/json/wmr/v3/Magicitems/magic-items.json';

import genericRules from '../data/json/wmr/v3/GenericRules/genericRules.json';

type FactionContextType = {
  allFactionData: FactionType[];
  selectedFactionData?: FactionType;
  setSelectedFactionByFactionId: (factionId: number) => void;
  getUpgradesForUnit: (unitId: string | number, isUnit: boolean, hasWizardUpgrade: boolean) => UpgradeType[] | undefined;
  allUpgradesForFaction: UpgradeType[];
};

export const FactionContext = createContext<FactionContextType>({} as FactionContextType);

export const FactionProvider = ({ children }: PropsWithChildren) => {
  /// this is the raw faction data we transform from the local data
  const [allFactionData, setAllFactionData] = useState<FactionType[]>([]);

  const [selectedFactionData, setSelectedFactionData] = useState<FactionType>();

  const [factionUpgrades, setFactionUpgrades] = useState([]);

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
        allPermittedUpgrades: a.upgrades,
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
  const allUpgradesForFaction = useMemo(() => {
    if (selectedFactionData) {
      let allUpgrades = selectedFactionData?.allPermittedUpgrades as UpgradeType[];
      let allPermittedGenericItems = magicItemsList.upgrades as UpgradeType[];
      let newArray = [...allUpgrades, ...allPermittedGenericItems];
      return newArray;
    } else {
      return [];
    }
  }, [selectedFactionData]);
  // get details specific to the selected faction
  const getUpgradesForUnit = (unitId: string | number, isUnit: boolean, hasWizardUpgrade: boolean) => {
    // get all upgrades for faction
    if (isUnit) {
      let unitDetails = selectedFactionData?.units.find((x) => x.id == unitId);
      if (unitDetails) {
        // find all faction upgrades for this unit
        let allUpgrades = selectedFactionData?.allPermittedUpgrades?.filter((x) => x.availableFor.includes(unitDetails.name));
        console.log('🚀 ~ getUpgradesForUnit ~ allUpgrades:', allUpgrades);
        // find all generic upgrades available for unit.
        const permittedGenericItems = magicItemsList.upgrades.filter((x) => x.availableFor.includes(unitDetails.type)) as UpgradeType[];
        // set points value for variable items
        permittedGenericItems.map((item) => {
          if (typeof item.points !== 'number') {
            let pointsObject = { ...item.points };
            if (item.modifierFor == 'hits') {
              item.points = pointsObject[unitDetails.hits as keyof typeof pointsObject];
            }
            if (item.modifierFor == 'armour') {
              item.points = pointsObject[unitDetails.armour as keyof typeof pointsObject];
            }
          }
        });
        allUpgrades?.push(...permittedGenericItems);
        return allUpgrades;
      }
    } else {
      let characterDetails = selectedFactionData?.characters.find((x) => x.id == unitId);
      if (characterDetails) {
        let allUpgrades = selectedFactionData?.allPermittedUpgrades?.filter((x) => x.availableFor.includes(characterDetails.name));
        // find all generic upgrades available for unit.
        const permittedGenericItems = magicItemsList.upgrades.filter((x) =>
          x.availableFor.includes(characterDetails.type)
        ) as UpgradeType[];
        if (hasWizardUpgrade) {
          const wizardUpgrades = magicItemsList.upgrades.filter((x) => x.availableFor.includes('Wizard')) as UpgradeType[];
          permittedGenericItems.push(wizardUpgrades);
        }
        allUpgrades?.push(...permittedGenericItems);
        return allUpgrades;
      }
    }
  };
  return (
    <FactionContext.Provider
      value={{ allFactionData, selectedFactionData, setSelectedFactionByFactionId, getUpgradesForUnit, allUpgradesForFaction }}>
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
