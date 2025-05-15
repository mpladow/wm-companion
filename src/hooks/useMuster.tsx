import { useFactionDataContext } from '@context/FactionDataContext';
import { useState } from 'react';
import { UnitType } from 'src/types/data/army';
import { ArmyListPersistenceType, CharacterPersistenceType, UnitPersistenceType } from 'src/types/models/persistence';
import { ArmyListType, CharacterType, MusterCharacterDetailsType, MusterUnitDetailsType, UnitDetailsType } from 'src/types/models/types';
import uuid from 'uuid-random';

export const useMuster = () => {
  const { allFactionData, selectedFactionData, getUpgradesForUnit, allUpgradesForFaction } = useFactionDataContext();
  const [loading, setLoading] = useState(false);
  const convertFromArmyPersistenceToViewModel = (army: ArmyListPersistenceType) => {
    setLoading(true);
    const armyVM: ArmyListType = {
      armyId: army.armyId,
      faction: army.faction,
      name: army.name,
      isFavourite: army.isFavourite,
      armyNotes: army.armyNotes,
      order: army.order,
      selectedUnits: [],
      selectedCharacters: [],
      points: 0,
    };

	 

    army.selectedUnits.forEach((unit) => {
      const foundUnit = { ...selectedFactionData?.units.find((x) => x.id == unit.unitId) } as MusterUnitDetailsType;
      if (foundUnit) {
        if (unit.selectedUpgrades.length > 0) {
          // add upgrades
          unit.selectedUpgrades.forEach((upgrade) => {
            // const isWizardUpgrade = getAllUpgradesForFaction.find((x) => x.name == upgrade.name)?.addsWizardType;
            // find upgrade
            const upgradeDetails = getUpgradesForUnit(foundUnit.id, true, false);
            if (upgradeDetails) {
              foundUnit.attachedUpgrades = [...upgradeDetails];
            }
          });
        }
        armyVM.selectedUnits.push(foundUnit);
      }
    });
	 console.log(army.selectedCharacters, 'sdfsdf')
    army.selectedCharacters.forEach((unit) => {
      const foundCharacter = { ...selectedFactionData?.characters.find((x) => x.id == unit.characterId) } as MusterCharacterDetailsType;
      if (foundCharacter) {
        if (unit.selectedUpgrades.length > 0) {
          // add upgrades
          unit.selectedUpgrades.forEach((upgrade) => {
            const isWizardUpgrade = allUpgradesForFaction.find((x) => x.name == upgrade.name)?.addsWizardType;
            // find upgrade
            const upgradeDetails = getUpgradesForUnit(foundCharacter.id, true, isWizardUpgrade ?? false);
            if (upgradeDetails) {
              foundCharacter.attachedUpgrades = [...upgradeDetails];
            }
          });
        }
        armyVM.selectedCharacters.push(foundCharacter);
      }
    });

    console.log('🚀 ~ convertFromArmyPersistenceToViewModel ~ armyVM:', armyVM);
    return armyVM;
  };
  const convertFromUnitPersistenceToViewModel = (unit: CharacterPersistenceType) => {
    //  const characterFound = { ...selectedFactionData?.characters.find((x) => x.id == unit.characterId) } as CharacterType;
    //  if (characterFound) {
    //    const newCharacter: CharacterType = {
    //      id: character
    //      characterId: unit.id,
    //      name: unit.name,
    //      selectedUpgrades: [],
    //    };
    //    return newCharacter;
    //  }
  };
  const convertFromCharacterPersistenceToViewModel = (character: CharacterType) => {};

  return {
    loading,
    convertFromArmyPersistenceToViewModel,
    convertFromUnitPersistenceToViewModel,
    convertFromCharacterPersistenceToViewModel,
  };
};
