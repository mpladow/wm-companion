import { useBuilderV2Context } from '@context/v2/BuilderV2Context';
import { useFactionListsV2 } from '@hooks/useFactionLists';
import { useEffect } from 'react';
import { ArmyListPersistenceType } from 'src/types/models/persistence';

/**Grabs all the faction details based off the userArmy */
export const useBuilderEditor = () => {
	const { selectedArmyList } = useBuilderV2Context();
	const { factionDetailsFromApi } = useFactionListsV2(selectedArmyList?.faction);

	const calculatePoints = (armyId: string) => {
		const factionDetails = factionDetailsFromApi
		console.log("🚀 ~ calculatePoints ~ userdddArmy:", factionDetails)

		let totalPoints = 0;
		console.log("🚀 ~ calculatePoints ~?:", selectedArmyList)
		selectedArmyList?.selectedUnits.map(x => {
			let unitPoints = 0;
			const unitFound = factionDetails?.units.find(u => x.unitId == u.id)
			if (unitFound) {

				console.log("🚀 ~ calculatePoints ~ unitFound:", x.id)
				unitPoints += unitFound?.points
				x.selectedUpgrades.map(up => {
					// if there are points, add
				})
			}
			totalPoints += unitPoints;
		})
		selectedArmyList?.selectedCharacters.map(x => {
			let characterPoints = 0;
			const characterFound = factionDetails?.characters.find(c => c.id == x.characterId);
			if (characterFound) {
				characterPoints += characterFound?.points;
				x.selectedUpgrades.map(up => {
					// add upgrade points;
				})
			}
			totalPoints += characterPoints;
		})
		return totalPoints;
	}

	const handleSetUserArmyListVm = () => {
		// set user army list into memory here.
	}

}