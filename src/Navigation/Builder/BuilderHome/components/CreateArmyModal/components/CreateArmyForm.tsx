import { ArmyListProps, useBuilderContext } from "@context/BuilderContext";
import { Theme } from "@hooks/useTheme";
import { DropDownItemProps } from "@navigation/Tracker/screens/Tracker";
import { Factions } from "@utils/constants";
import { getFactionsDropdown, getKeyByValue, getLocalFactionAssets } from "@utils/factionHelpers";
import { Button, Text } from "@components/index";
import { useFactionUnits } from "@utils/useFactionUnits";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View, Image, TextInput } from "react-native";
import { useToast } from "react-native-toast-notifications";
import fonts from "@utils/fonts";

const THUMBNAIL_HEIGHT = 100;
const THUMBNAIL_WIDTH = 100;
const SPACING = 5;

type CreateArmyFormType = {
	theme: Theme;
	handleDismissModal: () => void;
};
const CreateArmyForm = ({ theme, handleDismissModal }: CreateArmyFormType) => {
	const builder = useBuilderContext();

	const { getFactionUnitsByVersion } = useFactionUnits();
	const { t } = useTranslation(["builder", "common", "forms"]);
	const toast = useToast();
	const [ddFactions, setDdFactions] = useState<DropDownItemProps[]>([]);
	// form data
	const [factionNameError, setFactionNameError] = useState(false);
	const [factionName, setFactionName] = useState<string>("");

	const [factionSelection, setFactionSelection] = useState<number>();
	const [factionDescription, setFactionDescription] = useState([] as string[]);

	// faction selection
	const setCurrentActiveIndex = (index: number) => {
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
	const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

	useEffect(() => {
		const { ddFactionList } = getFactionsDropdown();
		setDdFactions(ddFactionList);
	}, []);
	useEffect(() => {
		// get factionDescription
		const factionunits = getFactionUnitsByVersion(factionSelection as number, CURRENT_VERSION);
		setFactionDescription(factionunits.description);
	}, [factionSelection]);
	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);

	const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
		if (factionName == "") {
			console.error("🚀 ~ onConfirmCreateArmyPress ~ factionName:", factionName);
			setFactionNameError(true);
		} else {
			setFactionNameError(false);
		}
		if (factionSelection && factionName != "") {
			builder
				.addUserArmyList(factionSelection, factionName, autopopulate, CURRENT_VERSION)
				.then((result) => {
					builder.setSelectedArmyList(result);
				})
				.catch(() => {})
				.finally(() => {
					// navigation.navigate("BuilderEdit");
					handleDismiss();
					toast.show(`New army created!`);
				});
		}
	};

	const resetForm = () => {
		setFactionSelection(undefined);
		setFactionName("");
	};

	const handleDismiss = () => {
		resetForm();
		handleDismissModal();
	};

	const thumbRef = useRef<FlatList>(null);
	const nameRef = useRef<TextInput>(null);

	return (
		<>
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
			<View style={{ marginVertical: 4, marginTop: 12 }}>
				<Text style={{ textAlign: "center", fontSize: 20 }} bold>
					{factionSelection && Factions[factionSelection]?.replaceAll("_", " ")}
				</Text>
			</View>
			<ScrollView
				onStartShouldSetResponder={() => true}
				contentContainerStyle={{ flexGrow: 1 }}
				scrollEnabled={true}
			>
				{factionSelection == null && (
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
						<Text style={{ textAlign: "center", fontSize: 20 }} bold>
							Select a faction
						</Text>
					</View>
				)}
				{factionDescription.map((item, index) => {
					return <Text style={{ textAlign: "center", paddingBottom: 4 }}>{item}</Text>;
				})}
			</ScrollView>
			<View style={{ marginTop: 12 }}>
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
						const armyName = item.value ? getKeyByValue(Factions, item?.value as number) : "";

						const factionAssets = getLocalFactionAssets(armyName ? armyName : "");
						return (
							<TouchableOpacity
								onPress={() => setCurrentActiveIndex(index)}
								key={index}
								style={{ overflow: "hidden" }}
							>
								<View
									style={{
										width: activeIndex == index ? THUMBNAIL_WIDTH + 5 : THUMBNAIL_WIDTH + 5,
										height: activeIndex == index ? THUMBNAIL_HEIGHT + 20 : THUMBNAIL_HEIGHT + 20,
										backgroundColor: theme.background,
										borderRadius: 8,
										borderColor: activeIndex == index ? theme.warning : theme.background,
										borderWidth: 2,
										marginRight: SPACING,
										overflow: "hidden",
									}}
								>
									<Image
										style={[
											styles.stretch,
											{
												width: activeIndex == index ? THUMBNAIL_WIDTH + 5 : THUMBNAIL_WIDTH + 5,
												height:
													activeIndex == index ? THUMBNAIL_HEIGHT - 2 : THUMBNAIL_HEIGHT - 2,
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
			<View style={{ paddingTop: 16 }}>
				<Button onPress={() => onConfirmCreateArmyPress(true)} variant={"confirm"}>
					<Text bold style={{ textTransform: "uppercase", color: theme.black }}>
						{t("Create", { ns: "common" })}
					</Text>
				</Button>
			</View>
		</>
	);
};
export default CreateArmyForm;
const styles = StyleSheet.create({
	stretch: {
		width: THUMBNAIL_WIDTH,
		height: THUMBNAIL_HEIGHT - 5,
		resizeMode: "cover",
		borderRadius: 8,
	},
});
