import { Alert, ImageBackground, Share, Image, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
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
import { Foundation } from "@expo/vector-icons";
import { generateHtml } from "./utils/exporterHelpers";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Text } from "@components/index";
import { useToast } from "react-native-toast-notifications";
import UnitCard from "./components/UnitCard";

const BuilderQuickView = () => {
	const navigation = useNavigation();
	const { theme } = useTheme();
	const [html, setHtml] = useState<string>();
	const builder = useBuilderContext();
	const toast = useToast();

	const handleShare = async () => {
		if (html) {
			try {
				const result = await Share.share({
					title: `${builder.selectedArmyList?.name} - ${builder.selectedArmyList?.faction}`,
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
					<Menu>
						<MenuTrigger>
							<Entypo name='dots-three-vertical' size={20} color={theme.text} />
						</MenuTrigger>
						<MenuOptions>
							<MenuOption onSelect={() => handleCopy()}>
								<View style={{ padding: 4, paddingVertical: 8, flexDirection: "row" }}>
									<View style={{ flex: 1, marginRight: 8 }}>
										<Foundation name='page-copy' size={20} color={theme.black} />
									</View>
									<View style={{ flex: 5 }}>
										<Text style={{ color: theme.black }}>Copy Text</Text>
									</View>
								</View>
							</MenuOption>
							<MenuOption onSelect={() => handleGenerateExport()}>
								<View style={{ padding: 4, paddingVertical: 8, flexDirection: "row" }}>
									<View style={{ flex: 1, marginRight: 8 }}>
										<Foundation name='page-export-pdf' size={20} color='black' />
									</View>
									<View style={{ flex: 5 }}>
										<Text style={{ color: theme.black }}>Generate PDF</Text>
									</View>
								</View>
							</MenuOption>
							<MenuOption onSelect={() => handleShare()}>
								<View style={{ padding: 4, paddingVertical: 8, flexDirection: "row" }}>
									<View style={{ flex: 1, marginRight: 8 }}>
										<Entypo name='share' size={20} color={theme.black} />
									</View>
									<View style={{ flex: 5 }}>
										<Text style={{ color: theme.black }}>Share</Text>
									</View>
								</View>
							</MenuOption>
						</MenuOptions>
					</Menu>
				),
			});
		}
	}, [navigation, html]);

	useEffect(() => {
		generatePlainText();
	}, [builder.selectedArmyList]);

	const generateHeader = () => {
		let _html = `${generateArmyNameAndPoints()} points \n`;
		_html += `${generateFaction()}\n`;
		_html += `${builder.getUnitCounts()}\n`;
		return _html;
	};
	const generateArmyNameAndPoints = () => {
		return `${builder.selectedArmyList?.name} | ${builder.calculateCurrentArmyPoints()}`;
	};
	const generateBreakPoints = () => {
		const _html = builder.getUnitCounts();
		return _html;
	};
	const generateFaction = () => {
		let html = "";
		html = `${getKeyByValue(Factions, builder.selectedArmyList?.faction)}\n`;
		html = `${html.replaceAll("_", " ")}`;
		return `${html}`;
	};
	const generatePlainText = () => {
		let _html = "";
		let header = generateHeader();
		_html += header;
		_html += "-----------------------------\n";
		_html += generateUnitPoints();
		_html += "-----------------------------\n";
		// _html += `${generateBreakPoints()}`;
		setHtml(_html);
	};
	const generateLeaderPointsForUi = () => {
		let leadersComponents: JSX.Element[] = [];
		builder.selectedArmyList?.selectedUnits
			.filter((u) => u.isLeader)
			.map((x) => {
				leadersComponents.push(
					<View style={{ flexDirection: "row", paddingVertical: 4 }}>
						<View style={{ flex: 1 }}>
							<Text style={{ color: theme.black }}>{x.currentCount}</Text>
						</View>
						<View style={{ flex: 3 }}>
							<Text style={{ color: theme.black }}>{x.unitName}</Text>
						</View>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<Text style={{ color: theme.black }}>{x.points}</Text>
						</View>
					</View>
				);

				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						leadersComponents.push(
							<View style={{ flexDirection: "row", paddingVertical: 4 }}>
								<View style={{ flex: 1 }}>
									<Text italic style={{ color: theme.black }}>
										(+ {x.currentCount})
									</Text>
								</View>
								<View style={{ flex: 3 }}>
									<Text italic style={{ color: theme.black }}>
										{item.upgradeName}
									</Text>
								</View>
								<View style={{ flex: 1, alignItems: "flex-end" }}>
									<Text italic style={{ color: theme.black }}>
										{item.points}
									</Text>
								</View>
							</View>
						);
					});
				}
			});
		return leadersComponents;
	};
	const generateUnitPointsForUi = () => {
		let unitsComponents: JSX.Element[] = [];
		builder.selectedArmyList?.selectedUnits
			.filter((u) => !u.isLeader)
			.map((x) => {
				unitsComponents.push(
					<View style={{ flexDirection: "row", paddingVertical: 4 }}>
						<View style={{ flex: 1 }}>
							<Text style={{ color: theme.black }}>{x.currentCount}</Text>
						</View>
						<View style={{ flex: 3 }}>
							<Text style={{ color: theme.black }}>{x.unitName}</Text>
						</View>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<Text style={{ color: theme.black }}>{x.points}</Text>
						</View>
					</View>
				);

				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						unitsComponents.push(
							<View style={{ flexDirection: "row", paddingVertical: 4 }}>
								<View style={{ flex: 1 }}>
									<Text italic style={{ color: theme.black }}>
										(+ {item.currentCount})
									</Text>
								</View>
								<View style={{ flex: 3 }}>
									<Text italic style={{ color: theme.black }}>
										{item.upgradeName}
									</Text>
								</View>
								<View style={{ flex: 1, alignItems: "flex-end" }}>
									<Text italic style={{ color: theme.black }}>
										{item.points}
									</Text>
								</View>
							</View>
						);
					});
				}
			});
		return unitsComponents;
	};
	const generateUnitPoints = () => {
		let _html = "";
		let leaders = "";
		builder.selectedArmyList?.selectedUnits
			.filter((u) => u.isLeader)
			.map((x) => {
				leaders += `${x.points * x.currentCount} ${x.points * x.currentCount > 100 ? "" : "\t"}  ${
					x.currentCount
				} x ${x.unitName} \n`;
				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						leaders += `\t + ${item.currentCount} x ${item.upgradeName} (${item.points})\n`;
					});
				}
			});
		_html += leaders;
		let units = "";
		builder.selectedArmyList?.selectedUnits
			.filter((u) => !u.isLeader)
			.map((x) => {
				units += `${x.currentCount * x.points} ${x.points * x.currentCount > 100 ? "" : "\t"} ${
					x.currentCount
				} x ${x.unitName} \n`;
				if (x.attachedItems) {
					x.attachedItems.map((item) => {
						units += `\t + ${item.currentCount} x ${item.upgradeName} (${item.points})\n`;
					});
				}
			});
		_html += units;

		return _html;
	};
	const handleCopy = async () => {
		if (html) {
			await Clipboard.setStringAsync(html);
			toast.show("List copied to clipboard!", {
				type: "normal",
				duration: 4000,
			});
		}
	};
	const handleGenerateExport = async () => {
		if (builder.selectedArmyList && builder.factionDetails) {
			try {
				const html = generateHtml(
					builder.selectedArmyList,
					builder.factionDetails,
					builder.calculateCurrentArmyPoints(),
					builder.getUnitCounts(),
					8
				);
				const { uri } = await Print.printToFileAsync({ html });
				if (Platform.OS == "ios") {
					await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
				} else {
					await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });

					// const permission = await MediaLibrary.requestPermissionsAsync();
					// if (permission.granted) {
					// 	// await MediaLibrary.createAssetAsync(uri);
					//     Print.printToFileAsync
					//     FileSystem.downloadAsync(uri, FileSystem.documentDirectory + builder.selectedArmyList.name)
					// }
				}
			} catch (e) {
				console.error(e, "ERROR");
			}
		}
	};
	const [printer, setPrinter] = useState<Print.Printer>();
	const selectPrinter = async () => {
		const printer = await Print.selectPrinterAsync(); // iOS only
		setPrinter(printer);
	};

	return (
		<View style={{ padding: 16, backgroundColor: "#FCF5E5", height: "100%" }}>
			<Image
				source={require("../../../assets/images/card-texture.png")}
				resizeMode='contain'
				style={{ opacity: 0.5, position: "absolute" }}
			/>
			{/* <StyledText style={{ fontSize: 16 }}>{html}</StyledText> */}

			<Text bold variant='heading3' style={{ color: theme.black, fontSize: 20 }}>
				{builder.selectedArmyList?.name}
			</Text>
			<Text italic style={{ color: theme.black }}>
				{generateFaction()}
			</Text>

			<View
				style={{
					borderTopWidth: 1,
					paddingTop: 8,
					paddingBottom: 8,
					borderBottomWidth: 1,
					borderColor: theme.black,
					marginBottom: 12,
					paddingHorizontal: 4,
				}}
			>
				{generateLeaderPointsForUi()}
				{generateUnitPointsForUi()}
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<Text style={{ color: theme.black }}>{builder.getUnitCounts()}</Text>
				</View>
				<View style={{ flex: 1, alignItems: "flex-end" }}>
					<Text bold style={{ color: theme.black }}>
						{builder.calculateCurrentArmyPoints()}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default BuilderQuickView;

const styles = StyleSheet.create({});
