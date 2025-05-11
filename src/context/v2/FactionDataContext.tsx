import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { FactionDto } from 'src/types/schema/faction';
import { AllSpecialRulesType, FactionType } from 'src/types/models/types';
import empireList from '../../data/json/wmr/v3/empire.json';
import albionList from '../../data/json/wmr/v3/albion.json';
import cathayList from '../../data/json/wmr/v3/cathay.json';

import genericRules from '../../data/json/wmr/v3/GenericRules/genericRules.json';
import { Factions } from '@utils/constants';

type FactionContextType = {
  setFaction: (id?: Factions) => void;
  factionDetailsFromApi?: FactionDto;
  factionDetails?: FactionType;
};

export const FactionContext = createContext<FactionContextType>({} as FactionContextType);

export const FactionProvider = ({ children }: PropsWithChildren) => {
  const [factionDetailsFromApi, setFactionDetailsFromApi] = useState<FactionDto>();
  const [factionSpecialRulesFromApi, setFactionSpecialRulesFromApi] =
    useState<AllSpecialRulesType[]>();

  const setFaction = (f?: Factions) => {
    console.log('🚀 ~ setFaction ~ faction:', f);
    getUnitsByFaction(f);
  };

  useEffect(() => {
    if (factionDetailsFromApi) {
      getSpecialRulesForFaction();
    }
  }, [factionDetailsFromApi]);

  //   useEffect(() => {
  //     if (factionDetailsFromApi && factionSpecialRulesFromApi) {
  //       parseFactionDetails();
  //     }
  //   }, [factionSpecialRulesFromApi]);

  //   const parseFactionDetails = () => {
  //     // set factionDetails - this will return a usuable object that can be easily read
  //     if (factionDetailsFromApi && factionSpecialRulesFromApi) {
  //       const factionType: FactionType = {
  //         name: factionDetailsFromApi?.name,
  //         version: factionDetailsFromApi.version,
  //         order: factionDetailsFromApi.order,
  //         description: factionDetailsFromApi.description,
  //         units: factionDetailsFromApi.units,
  //         characters: factionDetailsFromApi.characters,
  //         allSpecialRules: factionDetailsFromApi.factionSpecialRules,
  //         spells: factionDetailsFromApi.spells,
  //       };
  //     }
  //   };

  const getSpecialRulesForFaction = () => {
    // get all generic rules and all
    const list: AllSpecialRulesType[] = [];
    //1. Add genericl rules
    genericRules.forEach((r) => {
      let unitExists = factionDetailsFromApi?.units.find((x) => x.name == r.name);
      if (unitExists) {
        // add the special rule to the array
        list.push(r);
      }
    });
    // 2. add faction special rules to make it easier to assign special rules
    if (factionDetailsFromApi?.factionSpecialRules) {
      let factionDetailsParsed: AllSpecialRulesType[] = factionDetailsFromApi.factionSpecialRules;
      list.push(...factionDetailsParsed);
    }

    setFactionSpecialRulesFromApi(list);
  };

  const getUnitsByFaction = (faction?: Factions) => {
    console.log('🚀 ~ getUnitsByFaction ~ faction:', faction);
    // can replace this with an api call
    switch (faction) {
      // case Factions.Bretonnia:
      // 	list = bretonnianList.units;
      // 	factionList = bretonnianList as ArmyReferenceType;
      // 	description = bretonnianList.description;
      // 	break;
      // case Factions.Orcs:
      // 	list = orcList.units;
      // 	factionList = orcList as ArmyReferenceType;
      // 	description = orcList.description;
      // 	break;
      // case Factions.Tomb_Kings:
      // 	list = tombKingsList.units;
      // 	factionList = tombKingsList as ArmyReferenceType;
      // 	description = tombKingsList.description;
      // 	break;
      case Factions.Empire:
        setFactionDetailsFromApi(empireList as FactionDto);
        break;
      case Factions.Cathay:
        setFactionDetailsFromApi(cathayList as FactionDto);

        break;
      // case Factions.Skaven:
      // 	list = skavenList.units;
      // 	factionList = skavenList as ArmyReferenceType;
      // 	description = skavenList.description;

      // 	break;
      // case Factions.Chaos:
      // 	list = chaosList.units;
      // 	factionList = chaosList as ArmyReferenceType;
      // 	description = chaosList.description;

      // 	break;
      // case Factions.Wood_Elves:
      // 	list = woodElvesList.units;
      // 	factionList = woodElvesList as ArmyReferenceType;
      // 	description = woodElvesList.description;

      // 	break;
      // case Factions.Vampire_Counts:
      // 	list = vampireCountsList.units;
      // 	factionList = vampireCountsList as ArmyReferenceType;
      // 	description = vampireCountsList.description;

      // 	break;
      // case Factions.Beastmen:
      // 	list = beastmenList.units;
      // 	factionList = beastmenList as ArmyReferenceType;
      // 	description = beastmenList.description;

      // 	break;

      // case Factions.Goblins:
      // 	list = nightGoblinsList.units;
      // 	factionList = nightGoblinsList as ArmyReferenceType;
      // 	description = nightGoblinsList.description;

      // 	break;
      // case Factions.Dwarfs:
      // 	list = dwarvesList.units;
      // 	factionList = dwarvesList as ArmyReferenceType;
      // 	description = dwarvesList.description;

      // 	break;
      // case Factions.Dark_Elves:
      // 	list = darkElvesList.units;
      // 	factionList = darkElvesList as ArmyReferenceType;
      // 	description = darkElvesList.description;

      // 	break;
      // case Factions.High_Elves:
      // 	list = highElvesList.units;
      // 	factionList = highElvesList as ArmyReferenceType;
      // 	description = highElvesList.description;

      // 	break;
      // case Factions.Daemons:
      // 	list = daemonsList.units;
      // 	factionList = daemonsList as ArmyReferenceType;
      // 	description = daemonsList.description;

      // 	break;
      // case Factions.Nippon:
      // 	list = nipponList.units;
      // 	factionList = nipponList as ArmyReferenceType;
      // 	description = nipponList.description;

      // 	break;
      // case Factions.Chaos_Dwarfs:
      // 	list = chaosDwarvesList.units;
      // 	factionList = chaosDwarvesList as ArmyReferenceType;
      // 	description = chaosDwarvesList.description;

      // 	break;
      // case Factions.Dogs_of_War:
      // 	list = dogsOfWarList.units;
      // 	factionList = dogsOfWarList as ArmyReferenceType;
      // 	description = dogsOfWarList.description;

      // 	break;
      // case Factions.Araby:
      // 	list = arabyList.units;
      // 	factionList = arabyList as ArmyReferenceType;
      // 	description = arabyList.description;

      // 	break;
      // case Factions.Lizardmen:
      // 	list = lizardmenList.units;
      // 	factionList = lizardmenList as ArmyReferenceType;
      // 	description = lizardmenList.description;

      // 	break;
      case Factions.Albion:
        setFactionDetailsFromApi(albionList as FactionDto);

        break;

      // case Factions.Ogre_Kingdoms:
      // 	list = ogresList.units;
      // 	factionList = ogresList as ArmyReferenceType;
      // 	description = ogresList.description;

      // 	break;
      // case Factions.Kislev:
      // 	list = kislevList.units;
      // 	factionList = kislevList as ArmyReferenceType;
      // 	description = kislevList.description;

      // 	break;
      // case Factions.Norse:
      // 	list = norseList.units;
      // 	factionList = norseList as ArmyReferenceType;
      // 	description = norseList.description;

      // 	break;
      // case Factions.Witch_Hunters:
      // 	console.log(witchHunterList, "witch hunters list");
      // 	list = witchHunterList.units;
      // 	factionList = witchHunterList as ArmyReferenceType;
      // 	description = witchHunterList.description;

      // 	break;
      default:
        setFactionDetailsFromApi(undefined);

        break;
    }
  };
  return (
    <FactionContext.Provider value={{ setFaction, factionDetailsFromApi }}>
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
