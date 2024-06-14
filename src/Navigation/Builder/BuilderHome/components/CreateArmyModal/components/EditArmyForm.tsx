import FormLabel from "@components/forms/FormLabel";
import { Button, Text } from "@components/index";
import { ArmyListProps, useBuilderContext } from "@context/BuilderContext";
import { Theme } from "@hooks/useTheme";
import fonts from "@utils/fonts";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

const EditArmyForm = ({
	focusedArmy,
	theme,
	onDismiss,
}: {
	focusedArmy: ArmyListProps;
	theme: Theme;
	onDismiss: () => void;
}) => {
	const { t } = useTranslation(["builder", "common", "forms"]);
	const [factionName, setFactionName] = useState<string>(focusedArmy.name);
	const [factionNameError, setFactionNameError] = useState(false);
	const [setFactionNotesError, setSetFactionNotesError] = useState();
	const [factionNotes, setFactionNotes] = useState<string>(focusedArmy.armyNotes);
	const builder = useBuilderContext();

	const onArmyNameChange = () => {
		if (factionName !== "" && focusedArmy) {
			setFactionNameError(false);

			builder.updateArmyName(factionName, focusedArmy.armyId);
			builder.updateArmyNotes(focusedArmy.armyId, factionNotes);
			handleDismiss();
		} else {
			console.error("🚀 ~ onConfirmCreateArmyPress ~ factionName:", factionName);
			setFactionNameError(true);
		}
	};

	const handleDismiss = () => {
		resetForm();
		onDismiss();
	};

	const resetForm = () => {
		setFactionName("");
	};

	useEffect(() => {
		if (factionName != "") setFactionNameError(false);
	}, [factionName]);

	const nameRef = useRef<TextInput>(null);

	return (
		<View style={{ flex: 1, justifyContent: "space-between" }}>
			<View style={{ marginTop: 12 }}>
				<FormLabel label={t("ArmyName")} />
				<TextInput
					ref={nameRef}
					placeholder={t("PlaceholderEnterArmyName", { ns: "forms" })}
					value={factionName}
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
				></TextInput>
				{factionNameError && (
					<Text italic style={{ color: theme.danger }}>
						An army name is required
					</Text>
				)}
				<FormLabel label={t("Notes", { ns: "builder" })} />
				<TextInput
					multiline
					maxLength={200}
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
						factionNameError && { borderColor: theme.danger, borderWidth: 4 },
					]}
				/>
			</View>
			<View style={{ paddingTop: 12, justifyContent: "flex-end" }}>
				<Button onPress={() => onArmyNameChange()} variant={"confirm"}>
					<Text bold style={{ textTransform: "uppercase", color: theme.black }}>
						{t("Confirm", { ns: "common" })}
					</Text>
				</Button>
			</View>
		</View>
	);
};
export default EditArmyForm;
const styles = StyleSheet.create({});
