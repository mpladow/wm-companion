import { useFactionDataContext } from '@context/FactionDataContext';
import { useDispatch } from 'react-redux';
import { ArmyListPersistenceType } from 'src/types/models/persistence';

export const userArmyCalculator = () => {
  const dispatch = useDispatch();
  const { allFactionData } = useFactionDataContext();

  const calculatePointsByArmyDetails = (army: ArmyListPersistenceType) => {
    const armyDetails = allFactionData.find((x) => x.factionId == army.faction);
    if (armyDetails) {
      let count = 0;
      console.log('🚀 ~ calculatePointsByArmyDetails ~ armyDetails:', armyDetails);
      // iterate over units
      army.selectedUnits.map((x) => {
        const unitDetailsFromApi = armyDetails.units.find((u) => u.id == x.unitId);
        if (unitDetailsFromApi) count += unitDetailsFromApi.points;
        if (x.selectedUpgrades.length > 0) {
        }
      });
      armyDetails.units.map((unit) => {});
      // -- if any attached items, iterate over them
      // iterate over characters
      // -- if any attached items, iterate over them
    }
    return 69;
  };

  const getUpgradesForFaction = () => {
	// returns an array of  
  }
  return { calculatePointsByArmyDetails };
};
