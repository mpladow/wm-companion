import { Animated, SectionList, View } from "react-native";
import { ArmyListProps } from "@context/BuilderContext";
import { useTheme } from "@hooks/useTheme";
import ArmyListCard from "@navigation/Builder/components/ArmyListCard";
import { StandardModal, Text, TextBlock } from "@components/index";
import React, { useRef, useState } from "react";
import Constants from "expo-constants";
import CustomText from "@components/CustomText";
import { useToast } from "react-native-toast-notifications";
import LogoWmr from "@components/SVGS/LogoWmr";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation(["builder", "common", "forms"]);

	const onMigrateArmyPress = () => {
		selectedArmy && handleMigrateArmy(selectedArmy.armyId, CURRENT_VERSION);
		toast.show(`Army List migrated to ${CURRENT_VERSION}!`, {
			type: "success",
			duration: 4000,
		});
		setShowMigrateModal(false);
	};
	const HEADER_MAX_HEIGHT = 140;
	const HEADER_MIN_HEIGHT = 0;
	const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
	const DynamicHeader = ({ value }: any) => {
		const animatedHeaderHeight = value.interpolate({
			inputRange: [0, SCROLL_DISTANCE],
			outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			extrapolate: "clamp",
		});
		const animatedOpacity = value.interpolate({
			inputRange: [0, SCROLL_DISTANCE],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});
		return (
			<Animated.View style={[{ height: animatedHeaderHeight, opacity: animatedOpacity }]}>
				<>
					<View
						style={{
							alignSelf: "center",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<LogoWmr height={80} width={200} />
						<View style={{ marginTop: -12 }}>
							<Text variant='heading3' style={{ fontSize: 24 }}>
								{t("Builder", { ns: "common" })}
							</Text>
						</View>
					</View>
					<View style={{ marginTop: 12 }}>
						<Text variant='heading2' style={{ textAlign: "center", fontSize: 16 }}>
							Total Armies: {sectionListData[0]?.data?.length + sectionListData[1]?.data?.length}
						</Text>
					</View>
				</>
			</Animated.View>
		);
	};

	const scrollOffsetY = useRef(new Animated.Value(0)).current;
	return (
		<View style={{ zIndex: 999, flex: 1, padding: 16 }}>
			<DynamicHeader value={scrollOffsetY} />
			<SectionList
				onScroll={Animated.event(
					[
						{
							nativeEvent: { contentOffset: { y: scrollOffsetY } },
						},
					],
					{ useNativeDriver: false }
				)}
				bounces={false}
				alwaysBounceVertical={false}
				overScrollMode='never'
				scrollEventThrottle={0}
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
			{/* MIGRATION MODAL */}
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
