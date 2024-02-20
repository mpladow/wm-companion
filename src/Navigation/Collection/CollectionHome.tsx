import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	View,
	Image,
	Pressable,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	ScrollView,
} from "react-native";
import React, { useMemo, useState, useTransition } from "react";
import MainContainerWithImage from "@components/MainContainerWithImage";
import { useTheme } from "@hooks/useTheme";
import { CollectionList, MiniatureDetailsOverview, useCollection } from "@context/CollectionContext";
import Accordion from "react-native-collapsible/Accordion";
import { Factions } from "@utils/constants";
import { Button, Text } from "@components/index";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import MainContainerWithBlankBG from "@components/MainContainerWithBlankBG";
import CustomModal from "@components/CustomModal";
import FormLabel from "@components/forms/FormLabel";
import CollectionCreate from "./CollectionCreate";
import UnitListItem from "./components/UnitListItem";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuOptionButton from "@components/MenuOptionButton";
import PopupConfirm from "@components/PopupConfirm";
import { WorkflowType } from "./CollectionEdit";
import { getLocalFactionAssets } from "@utils/factionHelpers";

type SectionContentType = {
	title: string;
	content: MiniatureDetailsOverview[];
	collectionId: string;
	collectionName: string;
};
const CollectionHome = () => {
	const { t } = useTranslation("collection");
	const { theme } = useTheme();
	const { collectionList, deleteCollection } = useCollection();
	const [activeSections, setActiveSections] = useState<number[]>([]);
	const navigation = useNavigation();
	const sections = useMemo(() => {
		return collectionList?.map((cl) => ({
			title: Factions[cl.faction],
			collectionName: cl.collectionName,
			content: cl.miniatureDetails,
			collectionId: cl.collectionId.toString(),
		}));
	}, [collectionList]);
	const [editCollection, setEditCollection] = useState(false);
	const [editCollectionListId, setEditCollectionListId] = useState<string>();
	const [showCreateCollection, setShowCreateCollection] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [collectionToDelete, setCollectionToDelete] = useState<string>();
	const setImage = (factionName: string) => {
		const armyName = factionName;
		const factionAssets = getLocalFactionAssets(armyName ? armyName : "");
		return (
			<View
				style={{ position: "absolute", top: -50, right: -20, borderLeftColor: theme.white, borderLeftWidth: 4 }}
			>
				<Image style={[styles.stretch]} source={factionAssets && factionAssets[0]} />
			</View>
		);
	};
	const renderHeader = (section: SectionContentType) => {
		return (
			<View
				style={{
					backgroundColor: theme.backgroundVariant3,
					borderRadius: 8,
					minHeight: 100,
					alignItems: "center",
					overflow: "hidden",
					flexDirection: "row",
				}}
			>
				<Image
					source={require("../../../assets/images/card-texture.png")}
					resizeMode='contain'
					style={{ opacity: 0.2, position: "absolute" }}
				/>
				<View style={{ flex: 3, justifyContent: "center", margin: 20 }}>
					<Text variant='heading3' style={{ color: theme.text, fontSize: 24, marginBottom: 4 }}>
						{section.collectionName}
					</Text>
					<Text style={{ color: theme.text }}>{section?.title?.replaceAll("_", " ")}</Text>
				</View>
				<View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
					{setImage(section.title)}
					<LinearGradient
						colors={["rgba(31,46,39, 0.9)", "rgba(6,9,7, 0.0)"]}
						start={{ y: 0, x: 1 }}
						end={{ y: 0, x: 0 }}
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: -0,
							width: 120,
							height: 300,
							zIndex: 9,
						}}
					></LinearGradient>
					<Menu style={{ zIndex: 99 }}>
						<MenuTrigger>
							<MaterialCommunityIcons name='dots-vertical' size={24} color={theme.text} />
						</MenuTrigger>
						<MenuOptions
							optionsContainerStyle={{ borderRadius: 8, maxWidth: 170, backgroundColor: theme.blueGrey }}
						>
							<MenuOption
								onSelect={() => {
									setEditCollection(true);
									setEditCollectionListId(section.collectionId);
									setShowCreateCollection(true);
								}}
							>
								<MenuOptionButton
									icon={<FontAwesome name='pencil' size={18} color={theme.text} />}
									variant={"outline"}
									ButtonText={t("Edit", { ns: "common" })}
								/>
							</MenuOption>
							<MenuOption
								onSelect={() => {
									setCollectionToDelete(section.collectionId);
									setShowConfirmDelete(true);
								}}
							>
								<MenuOptionButton
									icon={<AntDesign name='delete' size={18} color={theme.white} />}
									variant={"danger"}
									ButtonText={t("Delete", { ns: "common" })}
								/>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			</View>
		);
	};

	const handleDeleteCollection = () => {
		collectionToDelete && deleteCollection(collectionToDelete).then(() => {});
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<MainContainerWithImage>
				<ScrollView style={{ zIndex: 999, padding: 16, paddingBottom: 500 }}>
					<View></View>
					<Accordion
						sections={sections}
						activeSections={activeSections}
						renderHeader={renderHeader}
						onChange={(as) => setActiveSections(as)}
						sectionContainerStyle={{ marginVertical: 12 }}
						containerStyle={{ zIndex: 999, backgroundColor: "transparent", paddingBottom: 300 }}
						renderContent={(section) => (
							<FlatList
								contentContainerStyle={{ marginTop: 8 }}
								data={section?.content}
								renderItem={({ item, index }) => {
									const totalMinisForCollection =
										item?.wishlistCount +
										item?.assembledCount +
										item?.completedCount +
										item?.ownedCount +
										item?.paintedCount;
									return (
										<UnitListItem
											item={item}
											index={index}
											collectionId={section.collectionId}
											totalInCollection={totalMinisForCollection}
										/>
									);
								}}
								ItemSeparatorComponent={() => (
									<View style={{ height: 4, backgroundColor: "transparent" }}></View>
								)}
							/>
						)}
					/>
				</ScrollView>
			</MainContainerWithImage>

			<View style={{ zIndex: 99999, position: "absolute", bottom: 30, right: 24 }}>
				<Button onPress={() => setShowCreateCollection(true)} variant={"confirm"}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<AntDesign name='plus' size={20} color='black' />
						<Text bold style={{ marginLeft: 4, color: theme.black }}>
							{t("AddCollection")}
						</Text>
					</View>
				</Button>
			</View>
			<CustomModal
				onDismiss={() => {
					() => setShowCreateCollection(!showCreateCollection);
				}}
				setModalVisible={() => setShowCreateCollection(!showCreateCollection)}
				headerTitle={
					editCollection
						? t("EditCollection", { ns: "collection" })
						: t("CreateCollection", { ns: "collection" })
				}
				modalVisible={showCreateCollection}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<CollectionCreate
						isEdit={editCollection}
						onDismiss={() => setShowCreateCollection(!showCreateCollection)}
						collectionId={editCollectionListId}
						completeConfirmation={() => setEditCollection(false)}
					/>
				</TouchableWithoutFeedback>
			</CustomModal>
			<PopupConfirm
				visible={showConfirmDelete}
				onConfirm={() => {
					handleDeleteCollection();
					setShowConfirmDelete(false);
				}}
				onCancel={() => {
					setShowConfirmDelete(false);
				}}
				text={
					<Text style={{ color: theme.text, fontSize: 16 }}>
						{t("DeleteCollectionConfirm", { ns: "collection" })}
					</Text>
				}
				confirmText={t("DeleteCollection", { ns: "collection" })}
				cancelText={t("Cancel", { ns: "common" })}
				headerText={t("DeleteCollection", { ns: "collection" })}
			/>
		</SafeAreaView>
	);
};

export default CollectionHome;

const styles = StyleSheet.create({
	stretch: {
		width: 120,
		height: 150,
		resizeMode: "cover",
	},
});
