import {
	Dimensions,
	FlatList,
	ImageBackground,
	Keyboard,
	Modal,
	SectionList,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	Image,
	ScrollView,
	Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@hooks/useTheme";
import { Button, CustomDropdown, StandardModal, Text, TextBlock } from "@components/index";
import { ArmyListProps, useBuilderContext } from "@context/BuilderContext";
import CustomModal from "@components/CustomModal";
import fonts from "@utils/fonts";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { getFactionsDropdown, getKeyByValue, getLocalFactionAssets } from "@utils/factionHelpers";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import PopupConfirm from "@components/PopupConfirm";
import { LinearGradient } from "expo-linear-gradient";
import FormLabel from "@components/forms/FormLabel";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { Factions } from "@utils/constants";
import { useFactionUnits } from "@utils/useFactionUnits";
import ArmySectionList, { armySectionListDataProps } from "./components/ArmySectionList";
import Constants from "expo-constants";

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;

// export type armySectionListDataProps = {
// 	title: string;
// 	data: ArmyListProps[];
// };

const BuilderHome = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const builder = useBuilderContext();
	const [showCreateArmy, setShowCreateArmy] = useState(false);
	// form data
	const [factionName, setFactionName] = useState<string>("");
	const [factionNameError, setFactionNameError] = useState(false);
	const [factionSelection, setFactionSelection] = useState<number>();
	const [factionNotes, setFactionNotes] = useState<string>("");

	const [confirmDialog, setConfirmDialog] = useState(false);
	const [editingArmy, setEditingArmy] = useState(false);
	const [focusedArmyId, setFocusedArmyId] = useState<string>();
	const [focusedArmy, setFocusedArmy] = useState<ArmyListProps>();
	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);

	const [showArmyNotes, setShowArmyNotes] = useState(false);

	const { getFactionUnitsByVersion } = useFactionUnits();
	const { t } = useTranslation(["builder", "common", "forms"]);
	const toast = useToast();
	const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

	useEffect(() => {
		const { ddFactionList } = getFactionsDropdown();
		setDdFactions(ddFactionList);
	}, []);
	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);
	useEffect(() => {
		if (focusedArmy) {
			setFactionNotes(focusedArmy?.armyNotes);
			setFactionName(focusedArmy?.name);
		}
	}, [focusedArmy]);

	const handleAddArmyPress = () => {
		setFactionName("");
		setFactionSelection(undefined);
		setShowCreateArmy(!showCreateArmy);
	};
	const handleEditArmyPress = (armyId: string) => {
		setFocusedArmyId(armyId);
		setFocusedArmy(builder.getArmyByArmyId(armyId));
		setEditingArmy(true);
		setShowCreateArmy(!showCreateArmy);
	};

	// const handleFactionSelection = (faction: number) => {
	// 	setFactionSelection(faction);
	// };
	const onArmyNameChange = () => {
		if (factionName !== "" && focusedArmyId) {
			builder.updateArmyName(factionName, focusedArmyId);
			builder.updateArmyNotes(focusedArmyId, factionNotes);
			setFocusedArmyId(undefined);
			setFocusedArmy(undefined);
			setEditingArmy(false);
			setShowCreateArmy(!showCreateArmy);
		}
	};

	const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
		if (factionName == "") {
			setFactionNameError(true);
		} else {
			setFactionNameError(false);
		}
		if (factionSelection && factionName != "") {
			builder
				.addUserArmyList(factionSelection, factionName, autopopulate, 1)
				.then((result) => {
					builder.setSelectedArmyList(result);
				})
				.catch(() => {})
				.finally(() => {
					// navigation.navigate("BuilderEdit");
					setShowCreateArmy(false);
				});
		}
	};
	const onArmyListPress = (armyId: string) => {
		builder.setSelectedArmyList(armyId);
		navigation.navigate("BuilderEdit");
	};
	const onDuplicateArmyPress = (armyId: string) => {
		builder.duplicateArmyList(armyId);
		toast.show("Army List duplicated!", {
			type: "success",
			duration: 4000,
		});
	};
	const onArmyListDeletePress = (armyId: string) => {
		setFocusedArmyId(armyId);
		setConfirmDialog(true);
	};
	const nameRef = useRef<TextInput>(null);

	const [sectionListData, setSectionListData] = useState<armySectionListDataProps[]>([]);
	useEffect(() => {
		const favourited = builder.userArmyLists.filter((x) => x.isFavourite);
		const notFavourited = builder.userArmyLists.filter((x) => !x.isFavourite);
		const sLData: armySectionListDataProps = {
			data: favourited,
			title: "Favourited",
		};
		const notFavouritedSLData: armySectionListDataProps = {
			data: notFavourited,
			title: "Armies",
		};
		const arr: armySectionListDataProps[] = [];
		arr.push(sLData);
		arr.push(notFavouritedSLData);
		setSectionListData(arr);
	}, [builder.userArmyLists]);
	const handleShowArmyNotesModal = (armyId: string) => {
		setFocusedArmy(builder.getArmyByArmyId(armyId));
		setShowArmyNotes(true);
	};

	// faction selection
	const thumbRef = useRef<FlatList>(null);
	const setCurrentActiveIndex = (index) => {
		if (index !== undefined) {
			setActiveIndex(index);
			const x = ddFactions[index]?.value;
			setFactionSelection(x as number);
		}
		if (index * (THUMBNAIL_WIDTH + 19 + SPACING) - (THUMBNAIL_WIDTH + 19) / 2 > width / 2) {
			thumbRef?.current?.scrollToOffset({
				offset: index * (THUMBNAIL_WIDTH + 19 + SPACING) - width / 2 + (THUMBNAIL_WIDTH + 18) / 2,
				// offset: index * (width / 2),
				animated: true,
			});
		} else {
			thumbRef?.current?.scrollToOffset({
				offset: 0,
				animated: true,
			});
		}
	};
	const [activeIndex, setActiveIndex] = useState(0);
	const { width, height } = Dimensions.get("screen");

	const [factionDescription, setFactionDescription] = useState([] as string[]);
	useEffect(() => {
		// get factionDescription
		const factionunits = getFactionUnitsByVersion(factionSelection as number, CURRENT_VERSION);
		setFactionDescription(factionunits.description);
	}, [factionSelection]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<ImageBackground
				source={require("../../../../assets/images/wmr_bg.png")}
				resizeMode='cover'
				style={[styles.image]}
			>
				<LinearGradient
					colors={["rgba(31,46,39, 0.4)", "rgba(6,9,7, 0.9)"]}
					start={{ y: 0, x: 0.5 }}
					end={{ y: 0.5, x: 0 }}
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: -0,
						height: Dimensions.get("screen").height,
						zIndex: 9,
					}}
				></LinearGradient>

				<ArmySectionList
					sectionListData={sectionListData}
					handleShowArmyNotesModal={handleShowArmyNotesModal}
					onDuplicateArmyPress={onDuplicateArmyPress}
					onArmyListPress={onArmyListPress}
					onArmyListDeletePress={onArmyListDeletePress}
					handleEditArmyPress={handleEditArmyPress}
					handleToggleFavourite={builder.toggleFavourite}
					handleMigrateArmy={builder.migrateArmyList}
				/>
				<PopupConfirm
					visible={confirmDialog}
					onConfirm={() => {
						focusedArmyId && builder.deleteUserArmyList(focusedArmyId);
						setConfirmDialog(false);
					}}
					onCancel={() => {
						setFocusedArmyId(undefined);
						setFocusedArmy(undefined);
						setConfirmDialog(false);
					}}
					text={<Text style={{ color: theme.text, fontSize: 16 }}>Do you want to delete this army?</Text>}
					confirmText={t("DeleteArmy", { ns: "builder" })}
					cancelText={t("Cancel", { ns: "common" })}
					headerText={t("DeleteArmy", { ns: "builder" })}
				/>
			</ImageBackground>
			<CustomModal
				onDismiss={() => {
					setFocusedArmyId(undefined);
					setFocusedArmy(undefined);
					setEditingArmy(false);
				}}
				setModalVisible={handleAddArmyPress}
				headerTitle={editingArmy ? t("EditArmy") : t("CreateArmy")}
				modalVisible={showCreateArmy}
			>
				<View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", padding: 12 }}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<>
							<View style={{ flex: 1, marginBottom: 12 }}>
								<FormLabel label={t("ArmyName")} />
								<TextInput
									ref={nameRef}
									placeholder={t("PlaceholderEnterArmyName", { ns: "forms" })}
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
								{!editingArmy ? (
									<>
										<View style={{ marginTop: 12 }}>
											<FormLabel label={t("Faction")} />
											<FlatList
												ref={thumbRef}
												horizontal
												data={ddFactions}
												// snapToInterval={width / 2 - THUMBNAIL_WIDTH + 5}
												contentContainerStyle={{
													paddingHorizontal: SPACING,
													paddingVertical: 4,
												}}
												renderItem={({ item, index }) => {
													const armyName = item.value
														? getKeyByValue(Factions, item?.value as number)
														: "";

													const factionAssets = getLocalFactionAssets(
														armyName ? armyName : ""
													);
													return (
														<TouchableOpacity
															onPress={() => setCurrentActiveIndex(index)}
															key={index}
															style={{ overflow: "hidden" }}
														>
															<View
																style={{
																	width:
																		activeIndex == index
																			? THUMBNAIL_WIDTH + 5
																			: THUMBNAIL_WIDTH + 5,
																	height:
																		activeIndex == index
																			? THUMBNAIL_HEIGHT + 20
																			: THUMBNAIL_HEIGHT + 20,
																	backgroundColor: theme.background,
																	borderRadius: 8,
																	borderColor:
																		activeIndex == index
																			? theme.warning
																			: theme.background,
																	borderWidth: 2,
																	marginRight: SPACING,
																	overflow: "hidden",
																}}
															>
																<Image
																	style={[
																		styles.stretch,
																		{
																			width:
																				activeIndex == index
																					? THUMBNAIL_WIDTH + 5
																					: THUMBNAIL_WIDTH + 5,
																			height:
																				activeIndex == index
																					? THUMBNAIL_HEIGHT - 2
																					: THUMBNAIL_HEIGHT - 2,
																		},
																	]}
																	source={factionAssets && factionAssets[0]}
																/>

																<View
																	style={{
																		zIndex: 999,
																		backgroundColor: theme.white,
																		height: 20,
																		borderBottomLeftRadius: 8,
																		borderBottomRightRadius: 8,
																	}}
																>
																	<Text
																		bold
																		style={{
																			textAlign: "center",
																			color: theme.textInverted,
																		}}
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
										<ScrollView
											onStartShouldSetResponder={() => true}
											contentContainerStyle={{ flexGrow: 1 }}
											scrollEnabled={true}
										>
											{factionDescription.map((item, index) => {
												return (
													<Text style={{ textAlign: "center", paddingBottom: 4 }}>
														{item}
													</Text>
												);
											})}
										</ScrollView>
									</>
								) : (
									<View style={{ marginTop: 12 }}>
										<FormLabel label={t("Notes", { ns: "builder" })} />
										<TextInput
											multiline
											value={factionNotes}
											onChangeText={(val) => setFactionNotes(val)}
											style={[
												{
													color: theme.black,
													fontFamily: fonts.PTSansBold,
													fontSize: 16,
													backgroundColor: theme.white,
													borderRadius: 16,
													padding: 16,
													paddingTop: 16,
													height: 100,
												},
												// factionNameError && { borderColor: theme.danger, borderWidth: 4 },
											]}
										/>
									</View>
								)}
							</View>
							<Button
								onPress={() => (editingArmy ? onArmyNameChange() : onConfirmCreateArmyPress(true))}
								variant={"confirm"}
							>
								<Text bold style={{ textTransform: "uppercase", color: theme.black }}>
									{editingArmy ? t("Confirm", { ns: "common" }) : t("Create", { ns: "common" })}
								</Text>
							</Button>
						</>
					</TouchableWithoutFeedback>
				</View>
			</CustomModal>
			<View style={{ zIndex: 99999, position: "absolute", bottom: 30, right: 24 }}>
				{/* <Button circle onPress={handleAddArmyPress} variant={"confirm"}>
							<AntDesign name='plus' size={24} color='black' />
						</Button> */}
				<Button onPress={handleAddArmyPress} variant={"confirm"}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<AntDesign name='plus' size={20} color='black' />
						<Text bold style={{ marginLeft: 4, color: theme.black }}>
							{t("AddArmy")}
						</Text>
					</View>
				</Button>
			</View>
			<StandardModal
				visible={showArmyNotes}
				content={
					<View style={{ flex: 1 }}>
						<TextInput
							multiline
							value={factionNotes}
							maxLength={10}
							onChangeText={(val) => setFactionNotes(val)}
							style={[
								{
									color: theme.text,
									fontFamily: fonts.GaramondMedium,
									fontSize: 16,
									borderRadius: 16,
									paddingTop: 16,
									height: 100,
								},
								// factionNameError && { borderColor: theme.danger, borderWidth: 4 },
							]}
						/>
					</View>
				}
				heading={t("ArmyNotes", { ns: "builder" })}
				onCancel={() => setShowArmyNotes(false)}
			/>
		</SafeAreaView>
	);
};

export default BuilderHome;

const styles = StyleSheet.create({
	dropdown: { paddingHorizontal: 16, padding: 8, borderRadius: 16 },
	stretch: {
		width: THUMBNAIL_WIDTH,
		height: THUMBNAIL_HEIGHT - 5,
		resizeMode: "cover",
		borderRadius: 8,
	},
	image: {
		flex: 1,
		justifyContent: "center",
		height: Dimensions.get("screen").height,
		position: "absolute",
		top: 0,
		width: Dimensions.get("screen").width,
	},
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		//backgroundColor: 'blue',
		backgroundColor: "rgba(0,0,0,0.1)",
	},
});
