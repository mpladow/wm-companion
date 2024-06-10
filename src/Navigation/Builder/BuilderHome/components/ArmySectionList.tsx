import { SectionList, StyleSheet, View } from "react-native";
import { ArmyListProps } from "@context/BuilderContext";
import { useTheme } from "@hooks/useTheme";
import ArmyListCard from "@navigation/Builder/components/ArmyListCard";
import { Text } from "@components/index";

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
};
const ArmySectionList = ({
	sectionListData,
	handleShowArmyNotesModal,
	onDuplicateArmyPress,
	onArmyListPress,
	onArmyListDeletePress,
	handleEditArmyPress,
	handleToggleFavourite,
}: BuilderHomeListProps) => {
	const { theme } = useTheme();

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
						/>
					);
				}}
			/>
		</View>
	);
};
export default ArmySectionList;
