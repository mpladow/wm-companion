import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { UnitTypes, UpgradeTypes } from "@utils/constants";
import { useTheme } from "@hooks/useTheme";
import Chariot from "./Chariot";
import Banner from "./Banner";
import MagicWeapon from "./MagicWeapon";
import DeviceOfPower from "./DeviceOfPower";
import MonstrousMount from "./MonstrousMount";
import Mount from "./Mount";
import SpecialItem from "./SpecialItem";

type UpgradeIconProps = {
	type: UpgradeTypes;
	size?: "small" | "large";
};
const UpgradeIcon = ({ type, size = "small" }: UpgradeIconProps) => {
	const { theme } = useTheme();
	const renderIcon = useMemo(() => {
		const size24 = size == "large" ? 24 * 2 : 24;
		const size28 = size == "large" ? 28 * 2 : 24;
		switch (type) {
			case UpgradeTypes.Magic_Standard:
				return <Banner size={24} color={theme.black} />;
			case UpgradeTypes.Magic_Weapon:
				return <MagicWeapon size={24} color={theme.black} />;
			case UpgradeTypes.Device_of_Power:
				return <DeviceOfPower size={24} color={theme.black} />;
			case UpgradeTypes.Monstrous_Mount:
				return <MonstrousMount size={16} color={theme.black} />;
			case UpgradeTypes.Special_Mount:
				return <Mount size={16} color={theme.black} />;
			case UpgradeTypes.Chariot_Mount:
				return <Chariot size={16} color={theme.black} isUpgrade={true} />;
			case UpgradeTypes.Special:
				return <SpecialItem size={16} color={theme.black} isUpgrade={true} />;
			default:
				return <SpecialItem size={16} color={theme.black} isUpgrade={true} />;
		}
	}, []);
	return <View style={{ alignItems: "center", justifyContent: "center" }}>{renderIcon}</View>;
};

export default UpgradeIcon;

const styles = StyleSheet.create({});
