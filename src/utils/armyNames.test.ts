import { Factions } from './constants';
import { factionArmyNameComponents, generateRandomArmyName } from './armyNames';

describe('armyNames', () => {
  it('has name components for every playable faction', () => {
    const playableFactions = Object.values(Factions).filter(
      (value): value is Factions =>
        typeof value === 'number' && value !== Factions.Regiments_Of_Renown,
    );

    playableFactions.forEach((faction) => {
      expect(factionArmyNameComponents[faction]).toBeDefined();
    });
  });

  it('generates a non-empty faction-themed army name', () => {
    const name = generateRandomArmyName(Factions.Empire);

    expect(name).toEqual(expect.any(String));
    expect(name.length).toBeGreaterThan(0);
    expect(name).not.toBe('Empire');
  });

  it('falls back to a generic fantasy army name for unknown factions', () => {
    const name = generateRandomArmyName(999);

    expect(name).toEqual(expect.any(String));
    expect(name.length).toBeGreaterThan(0);
  });
});
