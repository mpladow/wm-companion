import {
	Dimensions,
	FlatList,
	ImageBackground,
	Modal,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@hooks/useTheme";
import { Button, CustomDropdown, Text, TextBlock } from "@components/index";
import { useBuilderContext } from "@context/BuilderContext";
import CustomModal from "@components/CustomModal";
import fonts from "@utils/fonts";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { getFactions, getFactionUnits } from "@utils/factionHelpers";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import ArmyListCard from "./components/ArmyListCard";
import PopupConfirm from "@components/PopupConfirm";
import { LinearGradient } from "expo-linear-gradient";

const BuilderHome = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	const builder = useBuilderContext();
	const [showCreateArmy, setShowCreateArmy] = useState(false);
	// form data
	const [factionName, setFactionName] = useState<string>("");
	const [factionNameError, setFactionNameError] = useState(false);
	const [factionSelection, setFactionSelection] = useState<number>();

	const [confirmDialog, setConfirmDialog] = useState(false);
	const [editingArmy, setEditingArmy] = useState(false);
	const [focusedArmyId, setFocusedArmyId] = useState<string>();
	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);

	const handleAddArmyPress = () => {
		setShowCreateArmy(!showCreateArmy);
	};
	const handleEditArmyPress = (armyId: string) => {
		setFocusedArmyId(armyId);
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
			setFocusedArmyId(undefined);
			setEditingArmy(false);
			setShowCreateArmy(!showCreateArmy);
		}
	};
	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);
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
					<FlatList
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
					/>
				</View>

				<CustomModal
					onDismiss={() => {
						console.log("onDISMISS");
						setFocusedArmyId(undefined);
						setEditingArmy(false);
					}}
					setModalVisible={handleAddArmyPress}
					headerTitle='Create Army'
					modalVisible={showCreateArmy}
				>
					<View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
						<View style={{ flex: 1, marginBottom: 12 }}>
							<Text>Army Name</Text>
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
								<View style={{ marginTop: 12 }}>
									<Text>Faction</Text>
									<CustomDropdown
										value={factionSelection}
										style={[styles.dropdown, { backgroundColor: theme.white }]}
										placeholder='Select Faction'
										placeholderStyle={{ color: "#ddd" }}
										data={ddFactions}
										labelField='label'
										valueField='value'
										onChange={(item) => {
											handleFactionSelection(item.value);
										}}
									/>
								</View>
							) : null}
						</View>
						<Button
							onPress={() => (editingArmy ? onArmyNameChange() : onConfirmCreateArmyPress(true))}
							variant={"confirm"}
						>
							<Text bold style={{ textTransform: "uppercase", color: theme.black }}>
								{editingArmy ? "confirm" : "create"}
							</Text>
						</Button>
					</View>
				</CustomModal>
				<PopupConfirm
					visible={confirmDialog}
					onConfirm={() => {
						focusedArmyId && builder.deleteUserArmyList(focusedArmyId);
						setConfirmDialog(false);
					}}
					onCancel={() => {
						setFocusedArmyId(undefined);
						setConfirmDialog(false);
					}}
					text={<Text style={{ color: theme.text, fontSize: 16 }}>Do you want to delete this army?</Text>}
					confirmText={"Delete Army"}
					cancelText={"Cancel"}
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
});
