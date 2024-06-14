import { SectionList, View } from "react-native";
import { ArmyListProps } from "@context/BuilderContext";
import { useTheme } from "@hooks/useTheme";
import ArmyListCard from "@navigation/Builder/components/ArmyListCard";
import { StandardModal, Text, TextBlock } from "@components/index";
import React, { useState } from "react";
import Constants from "expo-constants";
import CustomText from "@components/CustomText";
import { useToast } from "react-native-toast-notifications";

export type armySectionListDataProps = {
	title: string;
	data: ArmyListProps[];
};

export type BuilderHomeListProps = {
	sectionListData: armySectionListDataProps[];
	handleShowArmyNotesModal: (armyId: string) => void;
	onDuplicateArmyPress: (armyId: string) => void;
	onArmyListPress: (armyId: string) => void;
	onArmyListDeletePress: (armyId: string) => void;
	handleEditArmyPress: (armyId: string) => void;
	handleToggleFavourite: (armyId: string) => void;
	handleMigrateArmy: (armyId: string, versionNumber: number) => void;
};
const ArmySectionList = ({
	sectionListData,
	handleShowArmyNotesModal,
	onDuplicateArmyPress,
	onArmyListPress,
	onArmyListDeletePress,
	handleEditArmyPress,
	handleToggleFavourite,
	handleMigrateArmy,
}: BuilderHomeListProps) => {
	const { theme } = useTheme();
	const [selectedArmy, setSelectedArmy] = useState<ArmyListProps>();

	const [showMigrateModal, setShowMigrateModal] = useState(false);
	const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;
	const toast = useToast();

	const onMigrateArmyPress = () => {
		selectedArmy && handleMigrateArmy(selectedArmy.armyId, CURRENT_VERSION);
		toast.show(`Army List migrated to ${CURRENT_VERSION}!`, {
			type: "success",
			duration: 4000,
		});
		setShowMigrateModal(false);
	};
	return (
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
				ItemSeparatorComponent={() => <View style={{ height: 8, backgroundColor: "transparent" }}></View>}
				renderItem={({ item, index }) => {
					// get total unit count
					return (
						<ArmyListCard
							armyList={item}
							handleOpenArmyNotes={(armyId) => handleShowArmyNotesModal(armyId)}
							handleDuplicateArmyPress={onDuplicateArmyPress}
							handleArmyListPress={onArmyListPress}
							handleDeleteArmyPress={onArmyListDeletePress}
							handleArmyNameChange={handleEditArmyPress}
							handleToggleFavourite={(armyId) => handleToggleFavourite(armyId)}
							handleMigrateArmyPress={(armyId) => {
								setSelectedArmy(item);
								setShowMigrateModal(true);
							}}
						/>
					);
				}}
			/>
			<StandardModal
				visible={showMigrateModal}
				onDismiss={() => setShowMigrateModal(false)}
				content={
					<View>
						<TextBlock>
							<CustomText>New army list data is available for this army.</CustomText>
						</TextBlock>
						<TextBlock>
							<CustomText>
								Migration will create a <CustomText bold>duplicated army list</CustomText> that will
								appear at the bottom of the list.
							</CustomText>
						</TextBlock>
						<CustomText>
							Your old list will <CustomText bold>still be accessible</CustomText> after migration, and
							can be deleted at any time.
						</CustomText>
					</View>
				}
				heading={`Migrate Army to ${CURRENT_VERSION}`}
				onSubmit={onMigrateArmyPress}
				onCancel={() => setShowMigrateModal(false)}
				submitText={`Migrate to ${CURRENT_VERSION}`}
				cancelText={"I will do this later"}
			></StandardModal>
		</View>
	);
};
export default ArmySectionList;
