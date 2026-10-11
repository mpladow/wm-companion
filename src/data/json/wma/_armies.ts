import { ArmyReferenceType, RegimentOfRenownArmyReferenceType } from 'src/types/data/army';
import achaemenidPersianList from './achaemenid-persian.json';
import greekList from './greek.json';

export const wmaArmiesV2: ArmyReferenceType[] = [
  greekList as ArmyReferenceType,
  achaemenidPersianList as ArmyReferenceType,
];

export const wmaRegimentsOfReknownListV1: RegimentOfRenownArmyReferenceType[] = [];
