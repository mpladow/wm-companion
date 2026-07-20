type UpgradeForBuilderCalculations = {
  points: number;
  currentCount?: number;
  [key: string]: unknown;
};

type UnitForBuilderCalculations = {
  points?: number;
  currentCount?: number;
  isLeader?: boolean;
  ignoreBreakPoint?: boolean;
  attachedItems: UpgradeForBuilderCalculations[];
  [key: string]: unknown;
};

export type ArmyForBuilderCalculations = {
  selectedUnits: UnitForBuilderCalculations[];
};

export const calculateArmyPoints = (armyList?: ArmyForBuilderCalculations) => {
  if (!armyList) {
    return 0;
  }

  return armyList.selectedUnits.reduce((armyTotal, unit) => {
    if (!unit.points || !unit.currentCount) {
      return armyTotal;
    }

    const unitTotal = unit.points * unit.currentCount;
    const upgradeTotal = unit.attachedItems.reduce((total, upgrade) => {
      if (!upgrade.currentCount) {
        return total;
      }

      return total + upgrade.points * upgrade.currentCount;
    }, 0);

    return armyTotal + unitTotal + upgradeTotal;
  }, 0);
};

export const calculateDisplayedPointsLimit = (
  currentPoints: number,
  pointsLimit?: string,
) => {
  if (pointsLimit != undefined) {
    return parseInt(pointsLimit);
  }

  if ((currentPoints > 1000 && currentPoints < 2000) || currentPoints == 2000) return 2000;
  if ((currentPoints > 2000 && currentPoints < 3000) || currentPoints == 3000) return 3000;
  if (currentPoints > 3000 && currentPoints < 4000) return 4000;
  if (currentPoints > 4000 && currentPoints < 5000) return 5000;
  if (currentPoints > 5000 && currentPoints < 6000) return 6000;

  return 1000;
};

export const calculateUnitCounts = (
  armyList?: ArmyForBuilderCalculations,
  factionDetails?: { name?: string },
) => {
  const units = armyList?.selectedUnits.filter((unit) => !unit.isLeader && !unit.ignoreBreakPoint);
  const totalCounts = units?.map((unit) => unit.currentCount);
  const unitCount = totalCounts?.reduce((total, currentValue) => {
    return total + (currentValue as number);
  }, 0);
  let breakCount = unitCount ? Math.round(unitCount / 2) : 0;

  if (factionDetails?.name == 'Nippon') {
    breakCount = breakCount + 1;
  }

  return `${breakCount}/${unitCount}`;
};
