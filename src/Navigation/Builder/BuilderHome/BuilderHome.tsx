import { Dimensions, FlatList, ImageBackground, StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@hooks/useTheme";
import { StandardModal, Text } from "@components/index";
import { ArmyListProps, useBuilderContext } from "@context/BuilderContext";
import fonts from "@utils/fonts";
import { useNavigation } from "@react-navigation/native";
import PopupConfirm from "@components/PopupConfirm";
import { LinearGradient } from "expo-linear-gradient";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import ArmySectionList, { armySectionListDataProps } from "./components/ArmySectionList";
import AddArmyButton from "./components/AddArmyButton";
import CreateArmyModal from "./components/CreateArmyModal/CreateArmyModal";

const BuilderHome = () => {
	const [showCreateArmy, setShowCreateArmy] = useState(false);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [focusedArmyId, setFocusedArmyId] = useState<string>();
	const [focusedArmy, setFocusedArmy] = useState<ArmyListProps>();
	const [showArmyNotes, setShowArmyNotes] = useState(false);
	const [sectionListData, setSectionListData] = useState<armySectionListDataProps[]>([]);

	const { theme } = useTheme();
	const navigation = useNavigation();
	const builder = useBuilderContext();
	const { t } = useTranslation(["builder", "common", "forms"]);
	const toast = useToast();

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
	const handleDismissArmyCreateModal = () => {
		setShowCreateArmy(false);
		setFocusedArmy(undefined);
	};
	const handleAddArmyPress = () => {
		setShowCreateArmy(true);
	};
	const handleEditArmyPress = (armyId: string) => {
		setFocusedArmy(builder.getArmyByArmyId(armyId));
		setShowCreateArmy(!showCreateArmy);
	};
	const onArmyListPress = (armyId: string) => {
		builder.setSelectedArmyList(armyId);
		setTimeout(() => {
			navigation.navigate("BuilderEdit");
		}, 200);
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
				/>

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
						setFocusedArmy(undefined);
						setConfirmDialog(false);
					}}
					text={<Text style={{ color: theme.text, fontSize: 16 }}>Do you want to delete this army?</Text>}
					confirmText={t("DeleteArmy", { ns: "builder" })}
					cancelText={t("Cancel", { ns: "common" })}
					headerText={t("DeleteArmy", { ns: "builder" })}
				/>
			</ImageBackground>
			<CreateArmyModal
				onDismissCreateArmyModal={handleDismissArmyCreateModal}
				theme={theme}
				focusedArmy={focusedArmy}
				isVisible={showCreateArmy}
			/>
			<AddArmyButton handleAddArmyPress={handleAddArmyPress} theme={theme} buttonName={t("AddArmy")} />
			{/* Army Notes MOdal */}
			<StandardModal
				visible={showArmyNotes}
				content={
					<View style={{ flex: 1 }}>
						<TextInput
							multiline
							value={focusedArmy?.armyNotes}
							maxLength={10}
							// onChangeText={(val) => setFactionNotes(val)}
							style={[
								{
									color: theme.text,
									fontFamily: fonts.PTSansRegular,
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
