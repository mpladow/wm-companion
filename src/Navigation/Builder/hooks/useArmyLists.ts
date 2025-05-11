import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArmyListPersistenceType } from 'src/types/models/persistence'
import { ArmyListVM } from '../components/ArmyListCardV2';
import { Factions } from '@utils/constants';
import { getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import { useFactionListsV2 } from '@hooks/useFactionLists';


/** used for the Army List screen */
export const useArmyLists = (allUserLists: ArmyListPersistenceType[]) => {
	const [userArmyListVM, setUserArmyListVM] = useState<ArmyListVM[]>()
	const { factionDetailsFromApi, findListByFaction } = useFactionListsV2();

	useEffect(() => {
		if (allUserLists) {
			userArmyListVMs()
		}
	}, [allUserLists])

	const calculatePoints = (armyId: string) => {
		const userArmy = allUserLists.find(x => x.armyId == armyId);
		const factionDetails = findListByFaction(userArmy?.faction as Factions)

		let totalPoints = 0;
		userArmy?.selectedUnits.map(x => {
			let unitPoints = 0;
			const unitFound = factionDetails?.units.find(u => x.unitId == u.id)
			if (unitFound) {

				unitPoints += unitFound?.points
				x.selectedUpgrades.map(up => {
					// if there are points, add
				})
			}
			totalPoints += unitPoints;
		})
		userArmy?.selectedCharacters.map(x => {
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

	const userArmyListVMs = () => {
		let vm = allUserLists.map(x => {
			const armyName = Factions[x.faction];
			const factionAssets = getLocalFactionAssets(armyName ? armyName : "");
			let obj: ArmyListVM = {
				armyId: x.armyId,
				factionName: getKeyByValue(Factions, x.faction)?.replaceAll("_", " ") ?? "Not Found",
				name: x.name,
				isFavourite: x.isFavourite,
				armyNotes: x.armyNotes,
				order: x.order,
				points: calculatePoints(x.armyId),
				imageUri: factionAssets && factionAssets[0],
			}
			return obj;
		})
		setUserArmyListVM(vm)
		// gets a dto list of armies for the home screen
	}
	return { userArmyListVM }
}