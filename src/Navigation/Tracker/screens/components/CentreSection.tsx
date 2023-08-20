import { Dimensions, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import ResultSection from "./ResultSection";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { Menu, MenuOption, MenuOptions as MO, MenuTrigger } from "react-native-popup-menu";
import { MenuOptions as MenuOptionsType } from "./MenuModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuOptionButton from "@components/MenuOptionButton";
import { FontAwesome } from "@expo/vector-icons";
import { useVictoryPoints } from "@context/VPContext";
import { Entypo } from "@expo/vector-icons";

type CentreSectionProps = {
	handleReset: () => void;
	handleSettingsPress: () => void;
	handleBlunderPress: () => void;
	handleOnSavePress: () => void;
	handleVictoryPointsPress: () => void;
	handleToggleOnePlayerMode: () => void;
	topResultValue?: ResultProps;
	bottomResultValue?: ResultProps;
};
const CentreSection = ({
	handleReset,
	handleSettingsPress,
	handleBlunderPress,
	handleToggleOnePlayerMode,
	handleVictoryPointsPress,
	topResultValue,
	bottomResultValue,
	handleOnSavePress,
}: CentreSectionProps) => {
	const { theme } = useTheme();
	const vpContext = useVictoryPoints();
	const [menuOpen, setMenuOpen] = useState(false);


	const onExpandedPress = () => {
		console.log(menuOpen ? "expanded" : "collapsed");
		setMenuOpen(!menuOpen);
	};
	const test = [
		{
			label: "Exit",
			onPress: handleSettingsPress,
			// icon: <Ionicons name='settings' size={24} color={theme.text} />,
			icon: <Ionicons name='exit-outline' size={24} color={theme.text} />,
		} as MenuOptionsType,
		{
			label: !vpContext.useOnePlayerMode ? "Set Solo Mode" : "Set Two Player Mode",
			onPress: handleToggleOnePlayerMode,
			// icon: <Ionicons name='settings' size={24} color={theme.text} />,
			icon: !vpContext.useOnePlayerMode ? (
				<Entypo name='user' size={20} color={theme.text} />
			) : (
				<Entypo name='users' size={20} color={theme.text} />
			),
		} as MenuOptionsType,
		{
			label: "Blunder Chart",
			onPress: handleBlunderPress,
			icon: <Ionicons name='warning' size={24} color={theme.text} />,
		},
		// {
		// 	label: "Save Game",
		// 	onPress: handleOnSavePress,
		// 	icon: <FontAwesome name='save' size={20} color={theme.text} />,
		// },
	];
	return (
		<>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
				<TouchableOpacity onPress={handleReset}>
					<Ionicons name='refresh' size={32} color={theme.text} />
				</TouchableOpacity>
			</View>
			<ResultSection resultOne={bottomResultValue} resultTwo={topResultValue} />
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "flex-end",
					overflow: "visible",
					zIndex: 999999,
				}}
			>
				{/* <MenuModal
					options={test}
					visible={menuOpen}
					onDismiss={() => setMenuOpen(!setxMenuOpen)}
					handleMenuPress={onExpandedPress}
				/> */}
				<Menu style={{ zIndex: 99 }}>
					<MenuTrigger>
						<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
					</MenuTrigger>
					<MO
						optionsContainerStyle={{
							backgroundColor: theme.black,
							borderRadius: 8,
							maxWidth: 170,
							marginTop: -100,
						}}
					>
						{test.map((x) => {
							return (
								<MenuOption onSelect={() => x.onPress()}>
									<MenuOptionButton icon={x.icon} variant={"outline"} ButtonText={x.label} />
								</MenuOption>
							);
						})}
					</MO>
				</Menu>
			</View>

		</>
	);
};

export default CentreSection;

const styles = StyleSheet.create({});
