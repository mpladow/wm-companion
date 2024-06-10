import { ArmyListProps } from "@context/BuilderContext";
import { asterixSingleRegex, Factions, newLineRegex, underscoreRegex } from "@utils/constants";
import { getGenericSpecialRules, getKeyByValue } from "@utils/factionHelpers";
import { FactionListProps, UnitProps, UpgradesProps } from "@utils/types";
const Mustache = require("mustache");
import magicItemsList from "../../../data/json/wmr/magic-items.json";
import { getUpgradeDetailsByName } from "./builderHelpers";

export const generateHtml = (
	army: ArmyListProps,
	factionDetails: FactionListProps,
	armyPoints: number,
	breakPoints: string,
) => {
	let template: string = `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
      td, th {
          text-align: center; 
          font-size: 16px
      },
      .tableHeaderRow {
        border-bottom: 2px solid #000;
      },
      .heading {
        font-weight: bold;
      },
      p, span {
        font-size: 8px
      }
      </style>
    </head>
    <body style="text-align: center; padding: 8px">
      ${generateHeader(army)}
      ${armySpecialRules(factionDetails)}
      ${generateUnitTable(army, factionDetails, breakPoints, armyPoints)}
      ${generateSpecialRules(army, factionDetails)}
      ${generateUsedMagicItems(army, factionDetails)}
      ${generateSpells(army, factionDetails)}
    </body>

  </html>`;
	const output = Mustache.render(template, army);
	return output;
};
export const generateSpecialRules = (army: ArmyListProps, factionDetails: FactionListProps) => {
	const template = `
    <div style="margin-bottom: 8px">
        <div style="align-items: center">
            <p class="heading" style="font-size: 16px; font-weight: bold">Special Rules</p>
        </div>
    </div>
    <div>
    {{#specialRules}}
    <p style="text-align: left">
        {{#order}}<span style="font-weight: bold">{{order}}</span>{{/order}}
        {{^order}}{{/order}}
        <span style='font-size: 14px'>{{{text}}}</span>
    </p>
    {{/specialRules}}
    </div>
    `;
	let specialRules = army.selectedUnits.map((u) => {
		//@ts-ignore - TODO: need to check typing
		const _specialRules = factionDetails?.specialRules[u.unitName];
		const _allGenericSpecialRules = getGenericSpecialRules();

		//@ts-ignore
		const _genericSpecialRulesExist = _allGenericSpecialRules[u.unitName];
		let rules;
		if (_specialRules?.text != undefined) {
			return _specialRules;
			// setSpecialRules(_specialRules);
		} else if (_genericSpecialRulesExist != undefined) {
			// sanitize text;
			rules = _genericSpecialRulesExist?.text.map((t: string) => {
				return t.replaceAll(asterixSingleRegex, (match) => {
					const res = match.replaceAll("*", "");
					return `<span style="font-style: italic">${res}</span>`;
				});
			});

			rules = rules?.map((t: string) => {
				return t.replaceAll(underscoreRegex, (match) => {
					const res = match.replaceAll("__", "");
					return `<span style="font-weight: bold, font-size: 1.2em">${res}</span>`;
				});
			});
			rules = rules?.map((x) => {
				return `<span style='font-size: 14px'>${x}</span><br>`;
			});
			rules = rules.join("");
			return { text: rules };
		} else {
			return;
		}
	});
	specialRules = specialRules.filter((x) => x !== undefined);
	console.log(specialRules, "SPECIAL RULES");

	const specialRulesList = { specialRules: specialRules };
	const output = Mustache.render(template, specialRulesList);
	if (specialRules || specialRules?.length > 0) {
		return output;
	} else {
		return "";
	}
};
export const generateUsedMagicItems = (army: ArmyListProps, factionDetails: FactionListProps) => {
	const _html = `
    <div style="margin-bottom: 8px">
        <div style="align-items: center">
            <p class="heading" style="font-size: 16px; font-weight: bold">Magic Items</p>
        </div>
    </div>
    <div>
    {{#upgrades}}
    <p style="text-align: left; font-size:14px">
    <span style="font-weight: bold">{{name}}</span> <span>{{text}}</span>
    {{/upgrades}}
    </p>
    </div>
    `;
	const usedUpgrades = army.selectedUpgrades.map((x) => {
		// find special rules
		let factionRule = factionDetails?.upgrades?.find((mi) => mi.name == x.upgradeName);
		if (factionRule == undefined) {
			factionRule = magicItemsList?.upgrades.find((mi) => mi.name == x.upgradeName);
		}
        else{
            factionRule.text = factionDetails?.specialRules[x.upgradeName]?.text;
        }
		return factionRule;
	});

	if (usedUpgrades.length > 0) {
		const usedUpgradesList = { upgrades: usedUpgrades };
		const output = Mustache.render(_html, usedUpgradesList);

		return output;
	} else {
		return "<span style='text-decoration: italic'>No Additional Information</span>";
	}
};
export const armySpecialRules = (factionDetails: FactionListProps) => {
	const template = `
    <div style="margin-bottom: 8px">
        <div style="align-items: center">
            <p class="heading" style="font-size: 16px; font-weight: bold">Army Special Rules</p>
        </div>
    </div>
    <p style='font-size:14px'>{{armyRules}}</p>
    `;
	const armyRules = { armyRules: factionDetails.armyRules };
	const output = Mustache.render(template, armyRules);
	if (!factionDetails.armyRules) {
		return "";
	} else {
		return output;
	}
};
export const generateSpells = (army: ArmyListProps, factionDetails: FactionListProps) => {
	const template = `
    <div style="margin-bottom: 8px">
        <div style="align-items: center">
            <p class="heading" style="font-size: 16px; font-weight: bold">Spells</p>
        </div>
    </div>
    <div>
    {{#spells}}
    <div style="text-align: left">
    <span style="font-weight: bold">{{name}}</span>
    <span>{{roll}}+ to cast</span>
    <span>{{range}}</span>
    <p style='font-size:14px'>{{{text}}}</p>
    </div>
    {{/spells}}
    </div>
    `;
	// sanitize spell descriptions
	let spellsArray = factionDetails?.spells?.map((o) => ({ ...o }));
	spellsArray?.map((sp) => {
		sp.text = sp?.text?.map((t: string) => {
			return t.replaceAll(asterixSingleRegex, (match) => {
				match.replaceAll("*", "");
				return `<span style="font-style: italic">${match}</span>`;
			});
		});

		sp.text = sp?.text?.map((t) => {
			return t.replace(newLineRegex, "<br>");
		});
	});
	let spellsList = { spells: spellsArray };
	if (spellsArray && spellsArray?.length > 0) {
		const output = Mustache.render(template, spellsList);
		return output;
	}
};

export const generateHeader = (armyProps: ArmyListProps) => {
	const armyHeaderDetails = { armyName: armyProps.name, faction: getKeyByValue(Factions, armyProps.faction) };
	let template = `
    <div style="margin-bottom: 16px">
        <div style="align-items: center">
            <p class="heading" style="font-size: 16px; font-weight: bold">{{armyName}} - {{faction}}</p>
        </div>
    </div>
    `;
	const output = Mustache.render(template, armyHeaderDetails);
	return output;
};

export const generateUnitTable = (
	armyProps: ArmyListProps,
	factionDetails: FactionListProps,
	breakPoints: string,
	armyCount: number
) => {
	let leaderDetailsList = armyProps.selectedUnits
		.filter((y) => y.isLeader)
		.map((x) => {
			if (factionDetails.units) {
				let _unit: UnitProps = factionDetails?.units
					.filter((u) => u.name == x.unitName)
					.map((y) => {
						return y as UnitProps;
					})[0];
				// let _unit = factionDetails?.units.find((u) => u.name == x.unitName);
				// get special rules
				if (factionDetails?.specialRules && _unit?.name) {
					//@ts-ignore - TODO: need to check typing
					const _specialRules = factionDetails?.specialRules[_unit.name];
					const _allGenericSpecialRules = getGenericSpecialRules();

					//@ts-ignore
					const _genericSpecialRulesExist = _allGenericSpecialRules[_unit.name];
					if (_specialRules?.text != undefined) {
						_unit.specialRules = _specialRules;
						// setSpecialRules(_specialRules);
					} else if (_genericSpecialRulesExist != undefined) {
						_unit.specialRules = _genericSpecialRulesExist;
					} else {
						_unit.specialRules = [];
					}

					_unit["upgradesExpanded"] = [];
					x.attachedItems.map((x) => {
						const upgrade = getUpgradeDetailsByName(x.upgradeName, factionDetails);
						_unit["upgradesExpanded"]?.push(upgrade);
					});
				}
				return _unit;
			}
		});
	let unitDetailsList = armyProps.selectedUnits
		.filter((y) => !y.isLeader)
		.map((x) => {
			if (factionDetails.units) {
				let _unit = factionDetails?.units.find((u) => u.name == x.unitName);
				// get special rules
				if (factionDetails?.specialRules && _unit?.name) {
					//@ts-ignore - TODO: need to check typing
					const _specialRules = factionDetails?.specialRules[_unit.name];
					const _allGenericSpecialRules = getGenericSpecialRules();
					//@ts-ignore
					const _genericSpecialRulesExist = _allGenericSpecialRules[_unit.name];
					if (_specialRules?.text != undefined) {
						_unit.specialRules = _specialRules;
						// setSpecialRules(_specialRules);
					} else if (_genericSpecialRulesExist != undefined) {
						_unit.specialRules = _genericSpecialRulesExist;
					} else {
						_unit.specialRules = [];
					}
					// get magic items details
                    _unit["upgradesExpanded"] = [];
					x.attachedItems.map((x) => {
						const upgrade = getUpgradeDetailsByName(x.upgradeName, factionDetails);
                        console.log('upgrade found for unit')
						_unit["upgradesExpanded"]?.push(upgrade);
					});
				}
				return _unit;
			}
		});
	const unitData = {
		units: unitDetailsList,
		leaders: leaderDetailsList,
		breakPoint: breakPoints,
		armyCount: armyCount,
	};

	const unitTemplate = `<table style="width: 100%">
    <tr style="border-bottom: 2px solid #000">
        <th style="text-align: left">Name</th>
        <th style="text-align: left">Type</th>
        <th>Attack</th>
        <th>Range</th>
        <th>Hits</th>
        <th>Armour</th>
        <th>Command</th>
        <th>Points</th>
        <th>Special</th>
    </tr>
    {{#leaders}}
    <tr>
        <td style="text-align: left">{{name}}</td>
        <td style="text-align: left">{{type}}</td>
        {{#attack}}<td>{{attack}}</td>{{/attack}}
        {{#range}}<td>{{range}}</td>{{/range}}
        {{^range}}<td>-</td>{{/range}}
        {{#hits}}<td>{{hits}}</td>{{/hits}}
        {{^hits}}<td>-</td>{{/hits}}

        {{#armour}}<td>{{armour}}</td>{{/armour}}
        {{^armour}}<td>-</td>{{/armour}}

        {{#command}}<td>{{command}}</td>{{/command}}
        {{^command}}<td>-</td>{{/command}}    <td>{{points}}</td>
        <td>{{specialRules.order}}</td>
    </tr>
    {{#upgradesExpanded}}
    <tr>
        <td style="text-align: left">({{name}})</td>
        <td style="text-align: left">{{type}}</td>
        <td>-</td>    
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>{{points}}</td>
    </tr>
    {{/upgradesExpanded}}
    {{/leaders}}

    {{#units}}
    <tr>
        <td style="text-align: left">{{name}}</td>
        <td style="text-align: left">{{type}}</td>
        <td>{{attack}}</td>
        {{#range}}<td>{{range}}</td>{{/range}}
        {{^range}}<td>-</td>{{/range}}
        {{#hits}}<td>{{hits}}</td>{{/hits}}
        {{^hits}}<td>-</td>{{/hits}}
        {{#armour}}<td>{{armour}}</td>{{/armour}}
        {{^armour}}<td>-</td>{{/armour}}
        <td>-</td>
        <td>{{points}}</td>
        <td>{{specialRules.order}}</td>
    </tr>
    {{#upgradesExpanded}}
    <tr>
        <td style="text-align: left">({{name}})</td>
        <td style="text-align: left">{{type}}</td>
        <td>-</td>   
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>{{points}}</td>
    </tr>
    {{/upgradesExpanded}}
    {{/units}}
    <tr>
        <td>
        {{armyCount}}
        </td>
        <td>
        {{breakPoint}}
        </td>
    </tr>
    </table>`;
	const output = Mustache.render(unitTemplate, unitData);
	return output;
};

// header - army name - army poubts
// special rules
// units table
// special rules list
// magic list
