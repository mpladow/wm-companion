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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@hooks/useTheme";
import { Button, CustomDropdown, Text, TextBlock } from "@components/index";
import { ArmyListProps, useBuilderContext } from "@context/BuilderContext";
import CustomModal from "@components/CustomModal";
import fonts from "@utils/fonts";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { getFactions, getFactionUnits } from "@utils/factionHelpers";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import ArmyListCard from "./components/ArmyListCard";
import PopupConfirm from "@components/PopupConfirm";
import { LinearGradient } from "expo-linear-gradient";
import FormLabel from "@components/forms/FormLabel";

export type armySectionListDataProps = {
	title: string;
	data: ArmyListProps[];
};
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

	useEffect(() => {
		const { ddFactionList } = getFactions();
		setDdFactions(ddFactionList);
	}, []);

	const handleFactionSelection = (faction: number) => {
		setFactionSelection(faction);
	};
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
	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);
	useEffect(() => {
		if (focusedArmy) {
			setFactionNotes(focusedArmy?.armyNotes);
			setFactionName(focusedArmy?.name);
		}
	}, [focusedArmy]);
	const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
		if (factionName == "") {
			setFactionNameError(true);
		} else {
			setFactionNameError(false);
		}
		if (factionSelection && factionName != "") {
			builder
				.addUserArmyList(factionSelection, factionName, autopopulate)
				.then((result) => {
					console.log(result, "ARMY ID");
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
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<ImageBackground
				source={require("../../../assets/images/wmr_bg.png")}
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
				<View style={{ zIndex: 999, flex: 1, padding: 16 }}>
					<SectionList
						style={{ zIndex: 9, marginBottom: 200 }}
						stickySectionHeadersEnabled
						ListFooterComponent={() => <View style={{ padding: 40 }}></View>}
						sections={sectionListData}
						renderSectionHeader={({ section: { title } }) => (
							<View
								style={{
									alignItems: "center",
									padding: 12,
									backgroundColor: theme.backgroundVariant2,
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text variant='heading3' style={{ fontSize: 20, textTransform: "uppercase" }}>
									{title}
								</Text>
							</View>
						)}
						ItemSeparatorComponent={() => (
							<View style={{ height: 8, backgroundColor: "transparent" }}></View>
						)}
						renderItem={({ item, index }) => {
							// get total unit count
							return (
								<ArmyListCard
									armyList={item}
									handleOpenArmyNotes={(armyId) => handleShowArmyNotesModal(armyId)}
									handleArmyListPress={onArmyListPress}
									handleDeleteArmyPress={onArmyListDeletePress}
									handleArmyNameChange={handleEditArmyPress}
									handleToggleFavourite={(armyId) => builder.toggleFavourite(armyId)}
								/>
							);
						}}
					/>
					{/* <FlatList
						ListFooterComponent={() => <View style={{ padding: 140 }}></View>}
						data={builder.userArmyLists}
						ItemSeparatorComponent={() => <View style={{ padding: 4 }}></View>}
						renderItem={({ item, index }) => {
							//TODO: Extract
							return (
								<ArmyListCard
									armyList={item}
									handleArmyListPress={onArmyListPress}
									handleDeleteArmyPress={onArmyListDeletePress}
									handleArmyNameChange={handleEditArmyPress}
								/>
							);
						}}
					/> */}
				</View>

				<CustomModal
					onDismiss={() => {
						setFocusedArmyId(undefined);
						setFocusedArmy(undefined);
						setEditingArmy(false);
					}}
					setModalVisible={handleAddArmyPress}
					headerTitle={editingArmy ? "Edit Army" : "Create Army"}
					modalVisible={showCreateArmy}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
							<>
								<View style={{ flex: 1, marginBottom: 12 }}>
									<FormLabel label={"Army Name"} />
									<TextInput
										ref={nameRef}
										placeholder='Enter Army Name'
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
												<FormLabel label={"Faction"} />
												<CustomDropdown
													value={factionSelection}
													style={[styles.dropdown, { backgroundColor: theme.white }]}
													placeholder='Select Faction'
													placeholderStyle={{ color: "#ddd" }}
													data={ddFactions}
													search
													searchPlaceholder='Search...'
													labelField='label'
													valueField='value'
													onChange={(item) => {
														handleFactionSelection(item.value);
													}}
												/>
											</View>
										</>
									) : (
										<View style={{ marginTop: 12 }}>
											<FormLabel label={"Notes"} />
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
										{editingArmy ? "confirm" : "create"}
									</Text>
								</Button>
							</>
						</View>
					</TouchableWithoutFeedback>
				</CustomModal>
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
					confirmText={"Delete Army"}
					cancelText={"Cancel"}
					headerText={"Delete Army"}
				/>
			</ImageBackground>
			<View style={{ zIndex: 99999, position: "absolute", bottom: 30, right: 24 }}>
				{/* <Button circle onPress={handleAddArmyPress} variant={"confirm"}>
							<AntDesign name='plus' size={24} color='black' />
						</Button> */}
				<Button onPress={handleAddArmyPress} variant={"confirm"}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<AntDesign name='plus' size={20} color='black' />
						<Text bold style={{ marginLeft: 4, color: theme.black }}>
							Add Army
						</Text>
					</View>
				</Button>
			</View>
			<Modal animationType='fade' visible={showArmyNotes} transparent={true}>
				<View style={styles.modalOverlay} onTouchStart={() => setShowArmyNotes(!showArmyNotes)}>
					<View
						style={{
							marginTop: Dimensions.get("screen").height / 3,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.blueGrey,
							padding: 16,
							margin: 12,
							borderRadius: 20,
						}}
					>
						<Text variant='heading3' style={{ color: theme.text, fontSize: 28 }}>
							Army Notes
						</Text>
						<TextInput
							multiline
							value={factionNotes}
							maxLength={10}
							onChangeText={(val) => setFactionNotes(val)}
							style={[
								{
									color: theme.text,
									fontFamily: fonts.PTSansBold,
									fontSize: 16,
									borderRadius: 16,
									padding: 16,
									paddingTop: 16,
									height: 100,
								},
								// factionNameError && { borderColor: theme.danger, borderWidth: 4 },
							]}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default BuilderHome;

const styles = StyleSheet.create({
	dropdown: { paddingHorizontal: 16, padding: 8, borderRadius: 16 },
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
