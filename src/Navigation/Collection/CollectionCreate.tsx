import { Dimensions, FlatList, StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FormLabel from "@components/forms/FormLabel";
import { useTheme } from "@hooks/useTheme";
import fonts from "@utils/fonts";
import { Button, CustomDropdown, Text } from "@components/index";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { useTranslation } from "react-i18next";
import { getFactionUnits, getFactions, getKeyByValue, getLocalFactionAssets } from "@utils/factionHelpers";
import { CollectionList, useCollection } from "@context/CollectionContext";
import { useNavigation } from "@react-navigation/core";
import { Factions } from "@utils/constants";

type CollectionCreateType = {
	onDismiss: () => void;
	isEdit: boolean;
	collectionId?: string;
	completeConfirmation: () => void;
};
const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;
const CollectionCreate = ({ onDismiss, isEdit, collectionId, completeConfirmation }: CollectionCreateType) => {
	const navigation = useNavigation();
	const nameRef = useRef<TextInput>(null);
	const [factionName, setFactionName] = useState<string>("");
	const [factionNameError, setFactionNameError] = useState(false);
	const [factionSelection, setFactionSelection] = useState<number>();
	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
	const handleFactionSelection = (faction: number) => {
		setFactionSelection(faction);
	};
	const { t } = useTranslation(["builder", "forms", "collection"]);
	const { theme } = useTheme();
	const collectionContext = useCollection();

	const [factionDescription, setFactionDescription] = useState([] as string[]);
	useEffect(() => {
		// get factionDescription
		const factionunits = getFactionUnits(factionSelection as number);
		setFactionDescription(factionunits.description);
	}, [factionSelection]);

	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);
	useEffect(() => {
		const { ddFactionList } = getFactions();
		setDdFactions(ddFactionList);
	}, []);

	const onConfirmCollectionCreate = async () => {
		if (factionName == "") {
			setFactionNameError(true);
		} else {
			setFactionNameError(false);
		}
		if (factionName != "") {
			console.log(factionName);
			if (isEdit && collectionId) {
				console.log(factionSelection);
				collectionContext
					.updateCollectionName(factionName, collectionId)
					.then((result) => {
						console.log("collectino updated");
					})
					.catch((err) => {
						console.error(err);
					})
					.finally(() => {
						onDismiss();
						completeConfirmation();
					});
				console.log(factionSelection);
			}
			if (!isEdit && factionSelection !== undefined) {
				collectionContext
					.createCollection(factionSelection, factionName)
					.then((result) => {
						console.log(result.collectionId, "collectionId");
						console.log(result.collectionName, "forms");
					})
					.catch(() => {
						console.log("ERROR");
					})
					.finally(() => {
						// navigation.navigate("BuilderEdit");
						onDismiss();
						completeConfirmation();
					});
			}
		}
	};
	const thumbRef = useRef<FlatList>(null);
	const setCurrentActiveIndex = (index) => {
		if (index !== undefined) {
			setActiveIndex(index);
			const x = ddFactions[index]?.value;
			setFactionSelection(x as number);
		}
		// if (index * (THUMBNAIL_WIDTH + SPACING) - THUMBNAIL_WIDTH / 2 > width / 2) {
		// 	thumbRef?.current?.scrollToOffset({
		// 		offset: index * (THUMBNAIL_WIDTH + SPACING) - width / 2 + THUMBNAIL_WIDTH / 2,
		// 		animated: true,
		// 	});
		// }
	};
	const [activeIndex, setActiveIndex] = useState(0);
	const { width, height } = Dimensions.get("screen");
	return (
		<View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", padding: 12 }}>
			<>
				<View style={{ flex: 1, marginBottom: 12 }}>
					<FormLabel label={t("CollectionName", { ns: "forms" })} />
					<TextInput
						ref={nameRef}
						placeholder={t("PlaceholderEnterCollectionName", { ns: "forms" })}
						onChangeText={(val) => setFactionName(val)}
						style={[
							{
								color: theme.black,
								fontFamily: fonts.PTSansBold,
								fontSize: 16,
								backgroundColor: theme.white,
								borderRadius: 16,
								padding: 16,
							},
							factionNameError && { borderColor: theme.danger, borderWidth: 4 },
						]}
					>
						{factionName}
					</TextInput>
					{factionNameError && (
						<Text italic style={{ color: theme.danger }}>
							An army name is required
						</Text>
					)}
					{!isEdit && (
						<>
							<View style={{ marginTop: 12 }}>
								<FormLabel label={t("Faction")} />

								<FlatList
									ref={thumbRef}
									horizontal
									data={ddFactions}
									snapToInterval={100}
									contentContainerStyle={{ paddingHorizontal: 50 }}
									// onMomentumScrollEnd={(ev) => {
									// 	setCurrentActiveIndex(
									// 		Math.floor(ev.nativeEvent.contentOffset.x / THUMBNAIL_WIDTH)
									// 	);
									// }}
									renderItem={({ item, index }) => {
										const armyName = item.value
											? getKeyByValue(Factions, item?.value as number)
											: "";

										const factionAssets = getLocalFactionAssets(armyName ? armyName : "");
										return (
											<TouchableOpacity onPress={() => setCurrentActiveIndex(index)} key={index}>
												<View
													style={{
														width: THUMBNAIL_WIDTH + 5,
														height: THUMBNAIL_HEIGHT + 20,
														backgroundColor: theme.background,
														borderRadius: 8,
														borderColor:
															activeIndex == index ? theme.warning : "transparent",
														borderWidth: 2,
														marginRight: SPACING,
														overflow: "hidden",
													}}
												>
													<Image
														style={[styles.stretch]}
														source={factionAssets && factionAssets[0]}
													/>

													<View
														style={{
															zIndex: 999,
															backgroundColor: theme.white,
															height: 20,
														}}
													>
														<Text
															bold
															style={{ textAlign: "center", color: theme.textInverted }}
														>
															{item.label}
														</Text>
													</View>
												</View>
											</TouchableOpacity>
										);
									}}
									ItemSeparatorComponent={() => <View style={{ width: 12 }}></View>}
								/>
							</View>
							<View style={{ marginVertical: 4 }}>
								<Text style={{ textAlign: "center", fontSize: 20 }} bold>
									{Factions[factionSelection]?.replaceAll("_", " ")}
								</Text>
							</View>
							<ScrollView>
								{factionDescription.map((item, index) => {
									return <Text style={{ textAlign: "center", paddingBottom: 4 }}>{item}</Text>;
								})}
							</ScrollView>

							{/* <View style={{ marginTop: 12 }}>
								<FormLabel label={t("Faction")} />
								<CustomDropdown
									value={factionSelection}
									style={[styles.dropdown, { backgroundColor: theme.white }]}
									placeholder={t("PlaceholderSelectFaction", { ns: "forms" })}
									placeholderStyle={{ color: "#ddd" }}
									data={ddFactions}
									search
									searchPlaceholder={`${t("Search", { ns: "common" })}...`}
									labelField='label'
									valueField='value'
									onChange={(item) => {
										handleFactionSelection(item.value);
									}}
								/>
							</View> */}
						</>
					)}
				</View>
				<Button onPress={() => onConfirmCollectionCreate()} variant={"confirm"}>
					<Text bold style={{ textTransform: "uppercase", color: theme.black }}>
						{isEdit ? t("Confirm", { ns: "common" }) : t("Create", { ns: "common" })}
					</Text>
				</Button>
			</>
		</View>
	);
};

export default CollectionCreate;

const styles = StyleSheet.create({
	dropdown: { paddingHorizontal: 16, padding: 8, borderRadius: 16 },
	stretch: {
		width: THUMBNAIL_WIDTH,
		height: THUMBNAIL_HEIGHT - 5,
		resizeMode: "cover",
		borderRadius: 8,
	},
});
