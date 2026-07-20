import type { ArmyForBuilderCalculations } from './builderCalculations';
import {
  calculateArmyPoints,
  calculateDisplayedPointsLimit,
  calculateUnitCounts,
} from './builderCalculations';

const createArmy = (selectedUnits: ArmyForBuilderCalculations['selectedUnits']) => ({
  selectedUnits,
});

describe('builderCalculations', () => {
  it('calculates unit and attached upgrade points from the saved army shape', () => {
    const army = createArmy([
      {
        id: 'unit-1',
        unitName: 'Spearmen',
        order: 1,
        points: 30,
        currentCount: 3,
        isLeader: false,
        attachedItems: [
          {
            id: 'upgrade-1',
            upgradeName: 'Banner',
            type: 'Magic Standard',
            attachedToName: 'Spearmen',
            points: 15,
            currentCount: 2,
          },
        ],
        unitSource: 'faction',
        type: 'Infantry',
      },
      {
        id: 'unit-2',
        unitName: 'General',
        order: 2,
        points: 125,
        currentCount: 1,
        isLeader: true,
        attachedItems: [],
        unitSource: 'faction',
        type: 'General',
      },
    ]);

    expect(calculateArmyPoints(army)).toBe(245);
  });

  it('uses a 1000 point display floor for dynamic points limits', () => {
    expect(calculateDisplayedPointsLimit(0)).toBe(1000);
    expect(calculateDisplayedPointsLimit(1000)).toBe(1000);
    expect(calculateDisplayedPointsLimit(1500)).toBe(2000);
    expect(calculateDisplayedPointsLimit(2500)).toBe(3000);
    expect(calculateDisplayedPointsLimit(2500, '1000')).toBe(1000);
  });

  it('calculates break count without leaders or no-count units and keeps the Nippon rule', () => {
    const army = createArmy([
      {
        id: 'unit-1',
        unitName: 'Infantry',
        order: 1,
        points: 30,
        currentCount: 3,
        isLeader: false,
        attachedItems: [],
        unitSource: 'faction',
        type: 'Infantry',
      },
      {
        id: 'unit-2',
        unitName: 'General',
        order: 2,
        points: 125,
        currentCount: 1,
        isLeader: true,
        attachedItems: [],
        unitSource: 'faction',
        type: 'General',
      },
      {
        id: 'unit-3',
        unitName: 'Ignored',
        order: 3,
        points: 20,
        currentCount: 2,
        isLeader: false,
        ignoreBreakPoint: true,
        attachedItems: [],
        unitSource: 'faction',
        type: 'Infantry',
      },
    ]);

    expect(calculateUnitCounts(army)).toBe('2/3');
    expect(calculateUnitCounts(army, { name: 'Nippon' })).toBe('3/3');
  });
});
