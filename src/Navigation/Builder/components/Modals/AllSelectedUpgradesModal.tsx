import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "@components/CustomModal";
import { UpgradesProps } from "@utils/types";
import UpgradeCard from "../UpgradeCard";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import { SelectedUpgradesProps } from "@context/BuilderContext";

type AllSelectedUpgradesModalType = {
	setVisible: (visibility: boolean) => void;
	visible: boolean;
	headerTitle: string;
	upgrades: UpgradesProps[];
	selectedUpgrades: SelectedUpgradesProps[];
};
const AllSelectedUpgradesModal = ({
	setVisible,
	visible,
	headerTitle,
	upgrades,
	selectedUpgrades,
}: AllSelectedUpgradesModalType) => {
	const [selectedUpgradesCondensed, setSelectedUpgradesCondensed] = useState<SelectedUpgradesProps[]>([]);
	const { theme } = useTheme();

	useEffect(() => {
		const uniqueItems: SelectedUpgradesProps[] = [];
		selectedUpgrades.map((up) => {
			const findItem = uniqueItems.find((x) => x.upgradeName === up.upgradeName);
			if (!findItem) uniqueItems.push(up);
		});
		setSelectedUpgradesCondensed(uniqueItems)
	}, [selectedUpgrades, upgrades]);

	return (
		<CustomModal setModalVisible={() => setVisible(!visible)} modalVisible={visible} headerTitle={headerTitle}>
			<View>
				<FlatList
					data={selectedUpgradesCondensed}
					renderItem={({ item }) => {
						const itemDetails = upgrades.find(x => x.name == item.upgradeName)
						return (
							<View style={{marginVertical: 4}}>
								<Text bold style={{ color: theme.text, fontSize: 16 }}>{item.upgradeName}</Text>
								<Text>{itemDetails?.text}</Text>
							</View>
						);
					}}
				/>
			</View>
		</CustomModal>
	);
};

export default AllSelectedUpgradesModal;

const styles = StyleSheet.create({});
