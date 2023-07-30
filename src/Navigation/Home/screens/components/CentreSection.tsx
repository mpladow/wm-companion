import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ResultSection from "./ResultSection";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MenuModal, { MenuOptions } from "./MenuModal";
import { AntDesign } from "@expo/vector-icons";

type CentreSectionProps = {
	handleReset: () => void;
	handleSettingsPress: () => void;
	handleBlunderPress: () => void;
	handleVictoryPointsPress: () => void;
	topResultValue?: ResultProps;
	bottomResultValue?: ResultProps;
};
const CentreSection = ({
	handleReset,
	handleSettingsPress,
	handleBlunderPress,
	handleVictoryPointsPress,
	topResultValue,
	bottomResultValue,
}: CentreSectionProps) => {
	const { theme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);

	const onExpandedPress = () => {
		console.log(menuOpen ? "expanded" : "collapsed");
		setMenuOpen(!menuOpen);
	};
	const test = [
		{
			label: "Settings",
			onPress: handleSettingsPress,
			// icon: <Ionicons name='settings' size={24} color={theme.text} />,
			icon: <AntDesign name="infocirlce" size={24} color={theme.text} />
		} as MenuOptions,
		{
			label: "Close",
			icon: <AntDesign name='close' size={24} color={theme.text} />,
		} as MenuOptions,
		{
			label: "Blunder",
			onPress: handleBlunderPress,
			icon: <Ionicons name='warning' size={24} color={theme.text} />,
		},
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
				<MenuModal
					options={test}
					visible={menuOpen}
					onDismiss={() => setMenuOpen(!setMenuOpen)}
					handleMenuPress={onExpandedPress}
				/>
			</View>
		</>
	);
};

export default CentreSection;

const styles = StyleSheet.create({});
