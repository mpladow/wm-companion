import { Factions } from './constants';

type ArmyNameComponents = {
  champions: string[];
  companies: string[];
  icons: string[];
  places: string[];
};

const genericArmyNameComponents: ArmyNameComponents = {
  champions: ['Marius', 'Roderic', 'Valen', 'Kastor'],
  companies: ['Warband', 'Host', 'Legion', 'Company'],
  icons: ['the Red Banner', 'the Broken Crown', 'the Iron Road', 'the Old World'],
  places: ['Borderland', 'Black Pass', 'Old Road', 'Grey Mountain'],
};

export const factionArmyNameComponents: Partial<Record<Factions, ArmyNameComponents>> = {
  [Factions.Bretonnia]: {
    champions: ['Gaston', 'Reynard', 'Alaric', 'Theodric'],
    companies: ['Lance', 'Errants', 'Grail Host', 'Chevaliers'],
    icons: ['the Lady', 'the Grail', 'Quenelles', 'the Fleur-de-Lys'],
    places: ['Couronne', 'Parravon', 'Carcassonne', 'Bastonne'],
  },
  [Factions.Orcs]: {
    champions: ['Grubnash', 'Gorbad', 'Skabgut', 'Urzog'],
    companies: ['Warband', 'Ladz', 'Big Mob', 'Ironhide Boyz'],
    icons: ['Gork', 'Mork', 'the Waaagh', 'the Black Pit'],
    places: ['Badlands', 'Black Crag', 'Iron Rock', 'Death Pass'],
  },
  [Factions.Tomb_Kings]: {
    champions: ['Setep', 'Khetep', 'Akhen', 'Nekhet'],
    companies: ['Legion', 'Phalanx', 'Chariots', 'Silent Host'],
    icons: ['Ptra', 'the Mortuary Cult', 'the Black Pyramid', 'the Scarab Crown'],
    places: ['Khemri', 'Numas', 'Zandri', 'Lybaras'],
  },
  [Factions.Empire]: {
    champions: ['Ludwig', 'Magnus', 'Leopold', 'Kurt'],
    companies: ['Fists', 'Swords', 'Halberds', 'Free Company'],
    icons: ['Sigmar', 'the Twin-Tailed Comet', 'Altdorf', 'the Hammer'],
    places: ['Reikland', 'Middenheim', 'Nuln', 'Talabheim'],
  },
  [Factions.Skaven]: {
    champions: ['Skritch', 'Vrrik', 'Snikkit', 'Kreech'],
    companies: ['Clawpack', 'Clawhost', 'Vermin Tide', 'Tunnel Swarm'],
    icons: ['the Horned Rat', 'Skavenblight', 'Warpstone', 'the Thirteenth Bell'],
    places: ['Under-Empire', 'Blight Pit', 'Festerhole', 'Crookback'],
  },
  [Factions.Chaos]: {
    champions: ['Archaon', 'Vardek', 'Kargan', 'Morkar'],
    companies: ['Warhost', 'Reavers', 'Chosen', 'Marauder Horde'],
    icons: ['the Dark Gods', 'the Eight-Pointed Star', 'the Wastes', 'Damnation'],
    places: ['Norsca', 'Troll Country', 'Brass Keep', 'the Chaos Wastes'],
  },
  [Factions.Wood_Elves]: {
    champions: ['Aelthir', 'Naestra', 'Thalandor', 'Elyra'],
    companies: ['Kindred', 'Glade Host', 'Wild Hunt', 'Waywatchers'],
    icons: ['Athel Loren', 'Kurnous', 'Isha', 'the Oak of Ages'],
    places: ['Talsyn', 'Argwylon', 'Wydrioth', 'Cythral'],
  },
  [Factions.Vampire_Counts]: {
    champions: ['Vlad', 'Mannfred', 'Konrad', 'Luthor'],
    companies: ['Grave Host', 'Night Court', 'Black Knights', 'Deathmarch'],
    icons: ['Sylvania', 'the Blood Keep', 'Morrslieb', 'the Barrow Crown'],
    places: ['Drakenhof', 'Mousillon', 'Templehof', 'Schwartzhafen'],
  },
  [Factions.Beastmen]: {
    champions: ['Ghorros', 'Morgur', 'Kazrak', 'Braygor'],
    companies: ['Brayherd', 'Warherd', 'Raiders', 'Horned Host'],
    icons: ['the Herdstone', 'the Dark Moon', 'the Blood-Ground', 'the Great Hunt'],
    places: ['Drakwald', 'Forest of Shadows', 'Middle Mountains', 'Bloodpine'],
  },
  [Factions.Cathay]: {
    champions: ['Yin-Tuan', 'Shen Li', 'Bao Long', 'Jun Wei'],
    companies: ['Dragon Host', 'Jade Banner', 'Celestial Guard', 'Iron Hail'],
    icons: ['the Dragon Emperor', 'the Great Bastion', 'the Jade Court', 'the Moon Empress'],
    places: ['Nan-Gau', 'Wei-Jin', 'Shang-Yang', 'Fu-Chow'],
  },
  [Factions.Goblins]: {
    champions: ['Skarsnik', 'Snagrat', 'Gitgob', 'Gribblit'],
    companies: ['Warband', 'Moon Mob', 'Squig Herd', 'Sneaky Gitz'],
    icons: ['the Bad Moon', 'Mork', 'Madcap Mushrooms', 'the Squig Pit'],
    places: ['Eight Peaks', 'Red Eye Mountain', 'Moonclan Cave', 'Crooked Moon'],
  },
  [Factions.Dwarfs]: {
    champions: ['Thorek', 'Grimnir', 'Borek', 'Kazador'],
    companies: ['Throng', 'Hammerers', 'Ironbreakers', 'Oathband'],
    icons: ['Grungni', 'the Book of Grudges', 'Karak Eight Peaks', 'the Ancestor Gods'],
    places: ['Karak Kadrin', 'Karaz-a-Karak', 'Karak Azul', 'Zhufbar'],
  },
  [Factions.Dark_Elves]: {
    champions: ['Malus', 'Drusala', 'Kouran', 'Lirith'],
    companies: ['Black Ark Host', 'Corsairs', 'Dread Spears', 'Shadow Host'],
    icons: ['Khaine', 'Naggaroth', 'the Witch King', 'the Black Ark'],
    places: ['Naggarond', 'Har Ganeth', 'Ghrond', 'Karond Kar'],
  },
  [Factions.High_Elves]: {
    champions: ['Tyrion', 'Teclis', 'Aenarion', 'Caledor'],
    companies: ['Warhost', 'Silver Helms', 'Phoenix Guard', 'Spears'],
    icons: ['Asuryan', 'Ulthuan', 'the Phoenix King', 'the White Tower'],
    places: ['Lothern', 'Saphery', 'Caledor', 'Chrace'],
  },
  [Factions.Daemons]: {
    champions: ['Kharzak', 'Sythrax', 'Poxul', 'Velkora'],
    companies: ['Daemonhost', 'Legion', 'Tallyband', 'Murder Choir'],
    icons: ['Khorne', 'Nurgle', 'Tzeentch', 'Slaanesh'],
    places: ['Realm of Chaos', 'Brass Citadel', 'Garden of Rot', 'Crystal Labyrinth'],
  },
  [Factions.Nippon]: {
    champions: ['Takeda', 'Kuroda', 'Masaru', 'Hirotaka'],
    companies: ['Warhost', 'Samurai Retinue', 'Ashigaru Banner', 'Tengu Guard'],
    icons: ['the Emperor', 'the Shrine', 'the Rising Sun', 'the Dragon Temple'],
    places: ['Edo', 'Yamato', 'Komainu Gate', 'Mount Kirin'],
  },
  [Factions.Chaos_Dwarfs]: {
    champions: ['Zhatan', 'Drazhoath', 'Ghorth', 'Hothgar'],
    companies: ['Hellforge Host', 'Infernal Guard', 'Blunderbusses', 'Iron Daemons'],
    icons: ['Hashut', 'the Black Fortress', 'the Daemon Furnace', 'Zharr-Naggrund'],
    places: ['Dark Lands', 'Plain of Zharr', 'Black Fortress', 'Uzkulak'],
  },
  [Factions.Dogs_of_War]: {
    champions: ['Borgio', 'Lorenzo', 'Marco', 'Vespero'],
    companies: ['Free Company', 'Pikemen', 'Mercenary Host', 'Paymasters'],
    icons: ['Myrmidia', 'Tilea', 'the Pay Chest', 'the Golden Banner'],
    places: ['Miragliano', 'Remas', 'Luccini', 'Tobaro'],
  },
  [Factions.Araby]: {
    champions: ['Suleiman', 'Jaffar', 'Hakim', 'Rashid'],
    companies: ['Desert Host', 'Corsairs', 'Janissaries', 'Sultanate Guard'],
    icons: ['the Crescent', 'the Golden Dhow', 'the Scimitar', 'the Burning Wind'],
    places: ['Al-Haikk', 'Copher', 'Lashiek', 'Great Desert'],
  },
  [Factions.Lizardmen]: {
    champions: ['Mazdamundi', 'Kroq-Gar', 'Tetto', 'Chakax'],
    companies: ['Cohort', 'Temple Guard', 'Saurus Host', 'Skink Swarm'],
    icons: ['Sotek', 'the Old Ones', 'Itzl', 'the Great Plan'],
    places: ['Hexoatl', 'Itza', 'Tlaxtlan', 'Zlatlan'],
  },
  [Factions.Albion]: {
    champions: ['Bran', 'Cuchul', 'Maeve', 'Dunrag'],
    companies: ['Warband', 'Tribesmen', 'Fen Host', 'Druid Circle'],
    icons: ['the Ogham Stones', 'the Mists', 'the Giant Causeway', 'the Old Faith'],
    places: ['Albion', 'Misty Isle', 'Stone Circle', 'Fenlands'],
  },
  [Factions.Ogre_Kingdoms]: {
    champions: ['Scrag', 'Greasus', 'Bragg', 'Gorger'],
    companies: ['Warband', 'Mawtribe', 'Ironguts', 'Bull Charge'],
    icons: ['the Great Maw', 'the Gutplate', 'the Feast', 'the Mountains of Mourn'],
    places: ['Mournfang Pass', 'Great Hall of Greasus', 'Maw Gate', 'Ivory Road'],
  },
  [Factions.Kislev]: {
    champions: ['Boris', 'Katarin', 'Yuri', 'Miska'],
    companies: ['Host', 'Winged Lancers', 'Red Guard', 'Ice Court'],
    icons: ['Ursun', 'the Motherland', 'the Ice Queen', 'the Bear God'],
    places: ['Kislev', 'Praag', 'Erengrad', 'Troll Country'],
  },
  [Factions.Norse]: {
    champions: ['Erik', 'Hrothgar', 'Ulf', 'Astrid'],
    companies: ['Warband', 'Huscarls', 'Berserkers', 'Raiders'],
    icons: ['the Raven Banner', 'the Sea Wolf', 'the Mammoth Tusk', 'the Longship'],
    places: ['Norsca', 'Skeggi', 'Bjornling Coast', 'Frostfang'],
  },
  [Factions.Witch_Hunters]: {
    champions: ['Matthias', 'Aldred', 'Solkan', 'Helmut'],
    companies: ['Purge Host', 'Zealots', 'Black-Coats', 'Templars'],
    icons: ['Sigmar', 'the Pyre', 'the Silver Hammer', 'the Witching Brand'],
    places: ['Altdorf', 'Mordheim', 'Sudenland', 'Wurtbad'],
  },
};

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const generateRandomArmyName = (faction?: number) => {
  const components = factionArmyNameComponents[faction as Factions] ?? genericArmyNameComponents;
  const champion = randomItem(components.champions);
  const company = randomItem(components.companies);
  const icon = randomItem(components.icons);
  const place = randomItem(components.places);

  const templates = [
    () => `${company} of ${icon}`,
    () => `${champion}'s ${company}`,
    () => `${place} ${company}`,
    () => `${company} of ${place}`,
  ];

  return randomItem(templates)();
};
