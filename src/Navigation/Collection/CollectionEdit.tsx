import { Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { MiniatureDetailsOverview, useCollection } from "@context/CollectionContext";
import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import UnitProgressCard from "./components/UnitProgressCard";
import { AntDesign, Entypo } from "@expo/vector-icons";
import _ from "lodash";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

export type WorkflowType = {
	key: keyof MiniatureDetailsOverview;
	name: string;
	primaryColor: string;
};
const CollectionEdit = ({ route, navigation }) => {
	const { collectionId, unitName } = route.params?.params;
	const [unit, setUnit] = useState<MiniatureDetailsOverview>();
	const { collectionList, updateUnit } = useCollection();
	const { theme } = useTheme();

	const workflow: WorkflowType[] = [
		{ key: "wishlistCount", name: "Wishlist", primaryColor: theme.darkRed },
		{ key: "ownedCount", name: "Owned", primaryColor: theme.orange },
		{ key: "assembledCount", name: "Assembled", primaryColor: theme.yellow },
		{ key: "paintedCount", name: "Painted", primaryColor: theme.lightGreen3 },
		{ key: "completedCount", name: "Completed", primaryColor: theme.darkGreen4 },
	];

	useEffect(() => {
		// get all units for selected army list
		navigation.setOptions({
			headerTitle: () => (
				<View style={{ flexDirection: "row" }}>
					<View style={{ width: 250 }}>
						<Text numberOfLines={1} variant='heading1' style={{ fontSize: 20 }}>
							{unitName}
						</Text>
					</View>
				</View>
			),
		});
	}, []);

	useEffect(() => {
		const _collection = collectionList.find((c) => c.collectionId == collectionId);
		const _collectionClone = _.cloneDeep(_collection);
		if (_collectionClone) {
			const _unit = _collectionClone.miniatureDetails.find((m) => m.unitName == unitName);
			const _unitClone = _.cloneDeep(_unit);
			setUnit(_unitClone);
		}
	}, [collectionId]);
	const getTotalMinis = useMemo(() => {
		if (unit)
			return (
				unit?.wishlistCount +
				unit?.assembledCount +
				unit?.completedCount +
				unit?.ownedCount +
				unit?.paintedCount
			);
		else {
			return 0;
		}
	}, [unit]);

	const modifyWishlist = (key: keyof MiniatureDetailsOverview, decrease?: boolean) => {
		if (unit) {
			//let trackerStat = unit[key];
			// if (decrease) {
			// const newCount = (trackerStat as number) - 1;
			// const updatedUnit = _.clone(unit);
			// trackerStat = (trackerStat as number) - 1;
			setUnit((oldUnit) => {
				if (oldUnit) {
					const toUpdate = _.cloneDeep(oldUnit);
					let trackerStat = toUpdate[key] as number;
					if (decrease) {
						if (trackerStat - 1 >= 0) {
							trackerStat = trackerStat - 1;
						}
					} else {
						trackerStat = trackerStat + 1;
					}
					toUpdate[key] = trackerStat as number;
					return toUpdate;
				}
			});
		}
	};
	const progressWorkflow = (
		currentwf: keyof MiniatureDetailsOverview,
		progress: boolean,
		previousWf?: keyof MiniatureDetailsOverview,
		nextWf?: keyof MiniatureDetailsOverview
	) => {
		if (unit) {
			setUnit((oldUnit) => {
				if (unit) {
					const toUpdate = _.cloneDeep(oldUnit);
					let previousTrackerStat = previousWf && (toUpdate[previousWf] as number);
					let currentTrackerStat = toUpdate[currentwf] as number;
					let nextTrackerStat = nextWf && (toUpdate[nextWf] as number);
					if (currentTrackerStat - 1 >= 0) {
						currentTrackerStat = currentTrackerStat - 1;
						if (progress && nextTrackerStat !== undefined) {
							nextTrackerStat = nextTrackerStat + 1;

							toUpdate[nextWf] = nextTrackerStat as number;
						} else if (!progress && previousTrackerStat !== undefined) {
							previousTrackerStat = previousTrackerStat + 1;

							toUpdate[previousWf] = previousTrackerStat as number;
						}
						toUpdate[currentwf] = currentTrackerStat as number;
					}
					return toUpdate;
				}
			});
		}
	};
	useEffect(() => {
		if (unit) updateUnit(collectionId, unit);
	}, [unit]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
			<View style={{ zIndex: 9, flex: 1, padding: 16 }}>
				<ScrollView style={{ paddingBottom: 400 }}>
					{workflow.map((wf, index) => {
						const currentKey = index;
						const nextKey = workflow[currentKey + 1];
						const previousKey = workflow[currentKey - 1];
						if (wf.key == "wishlistCount") {
							return (
								<UnitProgressCard
									key={index}
									primaryColor={wf.primaryColor}
									statName={wf.name}
									statValue={unit?.wishlistCount}
									total={getTotalMinis}
									onPressProgress={() => modifyWishlist(wf.key)}
									onPressReverseProgress={() => modifyWishlist(wf.key, true)}
									onWishlistProgress={() => progressWorkflow(wf.key, true, undefined, nextKey.key)}
									ctaProgressText={
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<AntDesign name='plus' size={20} color={theme.white} />
										</View>
									}
									ctaReverseProgressText={
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<AntDesign name='minus' size={20} color={theme.white} />
											{/* <Text>Progress to Assembled</Text> */}
										</View>
									}
									ctaWishlistProgressText={
										wf.key == "wishlistCount" ? (
											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<AntDesign name='down' size={20} color={theme.white} />
												{/* <Text>Progress to Assembled</Text> */}
											</View>
										) : undefined
									}
								/>
							);
						} else {
							return (
								<UnitProgressCard
									key={index}
									primaryColor={wf.primaryColor}
									statName={wf.name}
									statValue={unit ? (unit[wf.key] as number) : undefined}
									total={getTotalMinis}
									onPressProgress={
										wf.key != "completedCount"
											? () => progressWorkflow(wf.key, true, undefined, nextKey.key)
											: undefined
									}
									onPressReverseProgress={() =>
										progressWorkflow(wf.key, false, previousKey.key, undefined)
									}
									ctaProgressText={
										wf.key !== "completedCount" ? (
											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<AntDesign name='down' size={20} color={theme.white} />
												{/* <Text>Progress to Assembled</Text> */}
											</View>
										) : undefined
									}
									ctaReverseProgressText={
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<AntDesign name='up' size={20} color={theme.white} />
											{/* <Text>Progress to Assembled</Text> */}
										</View>
									}
								/>
							);
						}
					})}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default CollectionEdit;

const styles = StyleSheet.create({});
