import { useTheme } from "@hooks/useTheme";
import { UnitTypes } from "@utils/constants";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Archery from "./Archery";
import Artillery from "./Artillery";
import Cavalry from "./Cavalry";
import Chariot from "./Chariot";
import General from "./General";
import Hero from "./Hero";
import Infantry from "./Infantry";
import Machine from "./Machine";
import Monster from "./Monster";
import Wizard from "./Wizard";

type UnitIconProps = {
	noCount?: boolean;
	type: string;
	canShoot: boolean;
	size?: "small" | "large";
};
const UnitIcon = ({ noCount, type, canShoot, size = "small" }: UnitIconProps) => {
	const { theme } = useTheme();
	const renderIcon = useMemo(() => {
		const iconSize = size == "large" ? 24 * 2 : 24;
		const size28 = size == "large" ? 28 * 2 : 24;
		switch (type) {
			case UnitTypes.Infantry:
				if (canShoot) {
					return <Archery size={24} color={theme.black} />;
				} else {
					return <Infantry size={28} color={theme.black} />;
				}
			case UnitTypes.Cavalry:
				return <Cavalry size={28} color={theme.black} />;
			case UnitTypes.Chariot:
				return <Chariot size={24} color={theme.black} />;
			case UnitTypes.Artillery:
				return <Artillery size={24} color={theme.black} />;
			case UnitTypes.Monster:
				return <Monster size={28} color={theme.black} />;
			case UnitTypes.General:
				return <General size={24} color={theme.black} />;
			case UnitTypes.Hero:
				return <Hero size={24} color={theme.black} />;
			case UnitTypes.Wizard:
				return <Wizard size={24} color={theme.black} />;
			case UnitTypes.Machine:
				return <Machine size={24} color={theme.black} />;
			default:
				return (
					<View
						style={{
							width: 28,
							height: 28,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#e3d9bc",
							padding: 0,
						}}
					></View>
				);
		}
	}, []);
	return (
		<View style={{ alignItems: "center", justifyContent: "center", opacity: noCount ? 0.2 : 1 }}>{renderIcon}</View>
	);
};

export default UnitIcon;

const styles = StyleSheet.create({});
