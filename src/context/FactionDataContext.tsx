import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import magicItemsList from '../data/json/wmr/v3/Magicitems/magic-items.json';
import empireListV2 from '../data/json/wmr/v4/empire.json';

import { FactionSchema } from 'src/types/modelsv2/schema/faction';
import { SpecialRuleSchema } from 'src/types/modelsv2/schema/specialrule';
import { UpgradeSchema } from 'src/types/modelsv2/schema/upgrade';
import genericRules from '../data/json/wmr/v4/genericRules.json';

type FactionContextType = {
  allFactionData: FactionSchema[];
  selectedFactionData?: FactionSchema;
  getFactionNameById: (factionId: number) => string;
  setSelectedFactionByFactionId: (factionId: number) => void;
  getUpgradesForUnit: (unitId: string | number, isUnit: boolean, hasWizardUpgrade: boolean) => UpgradeSchema[] | undefined;
  allUpgradesForFaction: UpgradeSchema[];
};

export const FactionContext = createContext<FactionContextType>({} as FactionContextType);

export const FactionProvider = ({ children }: PropsWithChildren) => {
  /// this is the raw faction data we transform from the local data
  const [allFactionData, setAllFactionData] = useState<FactionSchema[]>([]);

  const [selectedFactionData, setSelectedFactionData] = useState<FactionSchema>();

  useEffect(() => {
    const allArmies: FactionSchema[] = [empireListV2 as FactionSchema];
    //  const allArmies = [empireList as FactionDto, albionList as FactionDto];
    const genericRulesTyped = genericRules as SpecialRuleSchema[];
    const allArmiesData = allArmies.map((a) => {
      // set generic special rules to faction details
      const additionalGenericRules = a.troopCards
        .flatMap((x) => {
          const foundSpecialRule = genericRulesTyped.find((r) => r.name == x.name);
          if (foundSpecialRule) {
            return foundSpecialRule;
          }
        })
        .filter((x) => x !== undefined);
      a.allSpecialRules.push(...additionalGenericRules);
      return a;
    });
    setAllFactionData(allArmiesData);
  }, []);

  const getFactionNameById = (factionId: number) => {
    return allFactionData.find((x) => x.id == factionId)?.name ?? '';
  };

  /** this will load up all faction data required for the army editor. This includes units, generic upgrades, etc.  */
  const setSelectedFactionByFactionId = useCallback(
    (factionId: number) => {
      const factionDataFound = allFactionData?.find((x) => x.id == factionId);
      console.log('🚀 ~ FactionProvider ~ factionDataFound:', factionDataFound);
      if (factionDataFound) {
        setSelectedFactionData(factionDataFound);
      }
      return factionDataFound;
    },
    [allFactionData],
  );
  const allUpgradesForFaction = useMemo(() => {
    if (selectedFactionData) {
      let allUpgrades = selectedFactionData?.allFactionUpgrades as UpgradeSchema[];
      let allPermittedGenericItems = magicItemsList.upgrades as UpgradeSchema[];
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
      let unitDetails = selectedFactionData?.troopCards.find((x) => x.id == unitId);
      if (unitDetails) {
        // find all faction upgrades for this unit
        let allUpgrades = selectedFactionData?.allFactionUpgrades?.filter((x) => x.availableToUnits?.includes(unitDetails.name));
        console.log('🚀 ~ getUpgradesForUnit ~ allUpgrades:', allUpgrades);
        // find all generic upgrades available for unit.
        const permittedUpgrades: UpgradeSchema[] = magicItemsList.upgrades.filter((x) =>
          x.availableFor.includes(unitDetails.unitCardType.name),
        ) as UpgradeSchema[];

        const permittedGenericItems: UpgradeSchema[] = magicItemsList.upgrades.filter((x) =>
          x.availableFor.includes(unitDetails.unitCardType.name),
        ) as UpgradeSchema[];
        // set points value for variable items
        permittedGenericItems.map((item) => {
          if (typeof item.points !== 'number') {
            let pointsObject = { ...item.points };
            if (item.points.variablePoints) {
              const dependantStat = item.points.variableStat;
              if (dependantStat) {
                const dependantStatValue = unitDetails[dependantStat as keyof typeof unitDetails];
                if (dependantStatValue) {
                  item.points.defaultPoints = item.points.variablePoints[dependantStatValue as keyof typeof item.points.variablePoints];
                }
              }
            }
          }
        });
        allUpgrades?.push(...permittedGenericItems);
        return allUpgrades;
      }
    } else {
      let characterDetails = selectedFactionData?.characterCards.find((x) => x.id == unitId);
      if (characterDetails) {
        let allUpgrades = selectedFactionData?.allFactionUpgrades?.filter((x) => x.availableToUnits?.includes(characterDetails.name));
        // find all generic upgrades available for unit.
        const permittedGenericItems = magicItemsList.upgrades.filter((x) =>
          x.availableFor.includes(characterDetails.unitCardType.name),
        ) as UpgradeSchema[];
        if (hasWizardUpgrade) {
          const wizardUpgrades = magicItemsList.upgrades.filter((x) => x.availableFor.includes('Wizard')) as UpgradeSchema[];
          permittedGenericItems.push(...wizardUpgrades);
        }
        allUpgrades?.push(...permittedGenericItems);
        return allUpgrades;
      }
    }
  };
  return (
    <FactionContext.Provider
      value={{
        allFactionData,
        getFactionNameById,
        selectedFactionData,
        setSelectedFactionByFactionId,
        getUpgradesForUnit,
        allUpgradesForFaction,
      }}>
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
