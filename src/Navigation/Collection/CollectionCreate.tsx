import { StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FormLabel from "@components/forms/FormLabel";
import { useTheme } from "@hooks/useTheme";
import fonts from "@utils/fonts";
import { Button, CustomDropdown, Text } from "@components/index";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { useTranslation } from "react-i18next";
import { getFactions } from "@utils/factionHelpers";
import { CollectionList, useCollection } from "@context/CollectionContext";
import { useNavigation } from "@react-navigation/core";

type CollectionCreateType = {
	onDismiss: () => void;
	isEdit: boolean;
	collectionId?: string;
	completeConfirmation: () => void;
};
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
							</View>
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
});
