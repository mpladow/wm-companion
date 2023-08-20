import { Alert, ImageBackground, Share, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useVictoryPoints } from "@context/VPContext";
import StyledText from "react-native-styled-text";
import { useBuilderContext } from "@context/BuilderContext";
import { Factions } from "@utils/constants";
import { getKeyByValue } from "@utils/factionHelpers";
import Button from "@components/button";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { useTheme } from "@hooks/useTheme";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { Foundation } from "@expo/vector-icons";

const BuilderQuickView = () => {
	const navigation = useNavigation();
	const { theme } = useTheme();
	const [html, setHtml] = useState<string>();
	const builder = useBuilderContext();

	const handleShare = async () => {
        if (html) {
		try {
			const result = await Share.share({
                title:`${builder.selectedArmyList?.name} - ${builder.selectedArmyList?.faction}` ,
				message: html,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error: any) {
			Alert.alert(error.message);
		}
    }
	};
	useLayoutEffect(() => {
		if (builder.selectedArmyList) {
			navigation.setOptions({
				title: "Export",
				headerRight: () => (
					<>
						<View style={{ marginRight: 28 }}>
							<TouchableOpacity onPress={handleShare}>
								<Entypo name='share' size={24} color={theme.text} />
							</TouchableOpacity>
						</View>
						<View style={{  }}>
							<TouchableOpacity onPress={handleCopy}>
								<Foundation name='page-copy' size={24} color={theme.text} />
							</TouchableOpacity>
						</View>
					</>
					// <Menu>
					// 	<MenuTrigger>
					// 		<Entypo name='dots-three-vertical' size={20} color={theme.text} />
					// 	</MenuTrigger>
					// 	<MenuOptions>
					// 		<MenuOption onSelect={() => handleCopy()}>
					// 			<View style={{ padding: 4, paddingVertical: 8 }}>
					// 				<Text style={{ color: theme.black }}>Copy Text</Text>
					// 			</View>
					// 		</MenuOption>
					// 		<MenuOption onSelect={() => handleCopy()}>
					// 			<View style={{ padding: 4, paddingVertical: 8 }}>
					// 				<Text style={{ color: theme.black }}>Share</Text>
					// 			</View>
					// 		</MenuOption>
					// 	</MenuOptions>
					// </Menu>
				),
			});
		}
	}, [navigation, html]);

	useEffect(() => {
		generatePlainText();
	}, [builder.selectedArmyList]);

	const generateHeader = () => {
		let _html = `${builder.selectedArmyList?.name} \t\t ${builder.calculateCurrentArmyPoints()} points \n`;
		_html += `${generateFaction()}`;
		return _html;
	};
	const generateBreakPoints = () => {
		const _html = builder.getUnitCounts();
		return _html;
	};
	const generateFaction = () => {
		const html = "";
		return `${getKeyByValue(Factions, builder.selectedArmyList?.faction)}\n`;
	};
	const generatePlainText = () => {
		let _html = "";
		let header = generateHeader();
		_html += header;
		_html += "-----------------------------\n";
		_html += generateUnitPoints();
		_html += "-----------------------------\n";
		_html += `${generateBreakPoints()}`;
		setHtml(_html);
	};
	const generateUnitPoints = () => {
		let _html = "";
		let leaders = "";
		builder.selectedArmyList?.selectedUnits
			.filter((u) => u.isLeader)
			.map((x) => {
				leaders += `${x.points * x.currentCount} \t ${x.currentCount} x ${x.unitName} \n`;
				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						leaders += `\u2022 ${item.currentCount} x ${item.upgradeName} (${item.points})\n`;
					});
				}
			});
		_html += leaders;
		let units = "";
		builder.selectedArmyList?.selectedUnits
			.filter((u) => !u.isLeader)
			.map((x) => {
				units += `${x.currentCount * x.points} \t ${x.currentCount} x ${x.unitName} \n`;
				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						units += `\u2022 ${item.currentCount} x ${item.upgradeName} x (${item.points})\n`;
					});
				}
			});
		_html += units;

		return _html;
	};
	const handleCopy = async () => {
		console.log(html, "copied html");
		if (html) {
			await Clipboard.setStringAsync(html);
		}
	};

	return (
		<View style={{ padding: 16}}>

			<StyledText style={{ fontSize: 16 }}>{html}</StyledText>
		</View>
	);
};

export default BuilderQuickView;

const styles = StyleSheet.create({});
