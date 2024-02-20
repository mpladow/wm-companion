import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MiniatureDetailsOverview } from "@context/CollectionContext";
import { useNavigation } from "@react-navigation/core";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import { Text } from "@components/index";
import { WorkflowType } from "../CollectionEdit";

type UnitListItemType = {
	item: MiniatureDetailsOverview;
	index: number | string;
	collectionId: string;
	totalInCollection: number;
};
const UnitListItem = ({ item, collectionId, index, totalInCollection }: UnitListItemType) => {
	const { navigate } = useNavigation();
	const { theme } = useTheme();

	const workflow: WorkflowType[] = [
		{ key: "wishlistCount", name: "Wishlist", primaryColor: theme.darkRed },
		{ key: "ownedCount", name: "Owned", primaryColor: theme.orange },
		{ key: "assembledCount", name: "Assembled", primaryColor: theme.yellow },
		{ key: "paintedCount", name: "Painted", primaryColor: theme.lightGreen3 },
		{ key: "completedCount", name: "Completed", primaryColor: theme.darkGreen4 },
	];
	return (
		<Pressable
			onPress={() =>
				navigate("CollectionEdit", {
					params: { unitName: item.unitName, collectionId: collectionId },
				})
			}
			style={{
				position: "relative",
				justifyContent: "space-between",
				backgroundColor: theme.backgroundVariant2,
				borderRadius: 8,
			}}
			key={index}
		>
			<View style={{ margin: 16, flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
				<View style={{ flex: 1 }}>
					<Text>{item.unitName}</Text>
				</View>
				<View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", flexDirection: "row" }}>
					<Text style={{ marginRight: 4 }}>
						{item.ownedCount + item.assembledCount + item.paintedCount + item.completedCount} Stands Owned
					</Text>
					<AntDesign name='right' size={20} color={theme.text} />
				</View>
			</View>
			<View
				style={{
					borderBottomLeftRadius: 8,
					width: "100%",
					height: 8,
					backgroundColor: theme.white,
					borderBottomRightRadius: 8,
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
				}}
			>
				<View
					style={{
						width: totalInCollection ? `${(item.wishlistCount / totalInCollection) * 100}%` : 0,
						height: 8,
						backgroundColor: workflow[0].primaryColor,
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
					}}
				></View>
				<View
					style={{
						width: totalInCollection ? `${(item.ownedCount / totalInCollection) * 100}%` : 0,
						height: 8,
						backgroundColor: workflow[1].primaryColor,
						position: "absolute",
						bottom: 0,
						left: totalInCollection ? `${(item.wishlistCount / totalInCollection) * 100}%` : 0,
						right: 0,
					}}
				></View>
				<View
					style={{
						width: totalInCollection ? `${(item.assembledCount / totalInCollection) * 100}%` : 0,
						height: 8,
						backgroundColor: workflow[2].primaryColor,
						position: "absolute",
						bottom: 0,
						left: totalInCollection
							? `${((item.wishlistCount + item.ownedCount) / totalInCollection) * 100}%`
							: 0,
						right: 0,
					}}
				></View>
				<View
					style={{
						width: totalInCollection ? `${(item.paintedCount / totalInCollection) * 100}%` : 0,
						height: 8,
						backgroundColor: workflow[3].primaryColor,
						position: "absolute",
						bottom: 0,
						left: totalInCollection
							? `${
									((item.wishlistCount + item.ownedCount + item.assembledCount) / totalInCollection) *
									100
							  }%`
							: 0,
						right: 0,
					}}
				></View>
				<View
					style={{
						width: totalInCollection ? `${(item.completedCount / totalInCollection) * 100}%` : 0,
						height: 8,
						backgroundColor: workflow[4].primaryColor,
						position: "absolute",
						bottom: 0,
						left: totalInCollection
							? `${
									((item.wishlistCount + item.ownedCount + item.assembledCount + item.paintedCount) /
										totalInCollection) *
									100
							  }%`
							: 0,
						right: 0,
					}}
				></View>
			</View>
		</Pressable>
	);
};

export default UnitListItem;

const styles = StyleSheet.create({});
