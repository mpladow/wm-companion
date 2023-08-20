import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuOptionButton from "@components/MenuOptionButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { Text } from "@components/index";
import { Entypo } from "@expo/vector-icons";

type unitDetailsMenuProps = {
	noMagic: boolean;
	onAddUnit: () => void;
	onAddUpgrade: () => void;
	onDeleteUnit: () => void;
};
const UnitDetailsMenu = ({ noMagic, onAddUnit, onAddUpgrade, onDeleteUnit }: unitDetailsMenuProps) => {
	const { theme } = useTheme();
	const [opened, setOpened] = useState(false);
	const onOptionSelected = (functionPressed: string) => {
		switch (functionPressed) {
			case "add":
				return onAddUnit();
		}
	};
	return (
		<Menu opened={opened} onBackdropPress={() => setOpened(!opened)}>
			<MenuTrigger onPress={() => setOpened(!opened)}>
				<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
			</MenuTrigger>
			<MenuOptions optionsContainerStyle={{ borderRadius: 8, maxWidth: 150, marginTop: -50, backgroundColor: theme.blueGrey }}>
				<MenuOption onSelect={() => onAddUnit()}>
					<MenuOptionButton
						icon={<Entypo name='plus' size={24} color='black' />}
						variant={"confirm"}
						ButtonText={"Add Unit"}
					/>
				</MenuOption>
				{noMagic ? (
					<MenuOption
						onSelect={() => {
							setOpened(true);
							onAddUpgrade();
						}}
					>
						<MenuOptionButton
							icon={<MaterialCommunityIcons name='sack' size={20} color={theme.white} />}
							variant={"outline"}
							ButtonText={"Add Item"}
						/>
					</MenuOption>
				) : (
					<MenuOption
						onSelect={() => {
							return null;
						}}
					>
						<View
							style={{
								flexDirection: "row",
								padding: 8,
								paddingHorizontal: 4,
								opacity: 0.6,
							}}
						>
							<View style={{ marginLeft: 8 }}>
								<Text italic style={{ color: theme.white }}>
									No Items Available
								</Text>
							</View>
						</View>
					</MenuOption>
				)}
				<MenuOption
					onSelect={() => {
						setOpened(true);
						onDeleteUnit();
					}}
				>
					<MenuOptionButton
						icon={<AntDesign name='delete' size={18} color={theme.white} />}
						variant={"danger"}
						ButtonText={"Delete"}
					/>
				</MenuOption>
			</MenuOptions>
		</Menu>
	);
};

export default UnitDetailsMenu;

const styles = StyleSheet.create({});
