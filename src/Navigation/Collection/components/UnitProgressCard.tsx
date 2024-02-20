import { Pressable, StyleSheet, View } from "react-native";
import React, { useMemo } from "react";

import { Text } from "@components/index";
import { useTheme } from "@hooks/useTheme";
type UnitProgressCardProps = {
	primaryColor: string;
	secondaryColor?: string;
	statName: string;
	statValue?: number;
	total: number;
	onPressProgress?: () => void;
	onPressReverseProgress?: () => void;
	ctaProgressText?: string | JSX.Element;
	ctaReverseProgressText?: string | JSX.Element;
	onWishlistProgress?: () => void;
	ctaWishlistProgressText?: string | JSX.Element;
};
const UnitProgressCard = ({
	statName,
	statValue,
	primaryColor,
	total,
	ctaProgressText,
	ctaReverseProgressText,
	onPressProgress,
	onPressReverseProgress,
	onWishlistProgress,
	ctaWishlistProgressText,
}: UnitProgressCardProps) => {
	const calculatePercentageWidth = useMemo(() => {
		if (statValue) {
			console.log((statValue / total) * 100, statName);
			return (statValue / total) * 100;
		}
	}, [total, statValue]);

	const { theme } = useTheme();
	return (
		<View style={{ flexDirection: "column", backgroundColor: theme.background, padding: 8, marginBottom: 8 }}>
			<View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
				{onWishlistProgress !== undefined && (
					<Pressable
						onPress={() => onWishlistProgress()}
						style={{
							justifyContent: "center",
							height: 45,
							width: 45,

							alignItems: "center",
							backgroundColor: primaryColor,
							marginVertical: 8,
							borderRadius: 50,
							marginRight: 12,
						}}
					>
						{ctaProgressText == typeof "string" ? (
							<Text style={{ color: primaryColor }}>{ctaWishlistProgressText}</Text>
						) : (
							ctaWishlistProgressText
						)}
					</Pressable>
				)}
				{onPressProgress !== undefined && (
					<Pressable
						onPress={() => onPressProgress()}
						style={{
							justifyContent: "center",
							height: 45,
							width: 45,

							alignItems: "center",
							backgroundColor: primaryColor,
							marginVertical: 8,
							borderRadius: 50,
							marginRight: 12,
						}}
					>
						{ctaProgressText == typeof "string" ? (
							<Text style={{ color: primaryColor }}>{ctaProgressText}</Text>
						) : (
							ctaProgressText
						)}
					</Pressable>
				)}

				{onPressReverseProgress && (
					<Pressable
						onPress={() => onPressReverseProgress()}
						style={{
							justifyContent: "center",
							height: 45,
							width: 45,
							padding: 4,
							alignItems: "center",
							backgroundColor: primaryColor,
							marginVertical: 8,
							borderRadius: 50,
						}}
					>
						{ctaReverseProgressText == typeof "string" ? (
							<Text style={{ color: primaryColor }}>{ctaReverseProgressText}</Text>
						) : (
							ctaReverseProgressText
						)}
					</Pressable>
				)}
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ backgroundColor: theme.blueGrey, borderRadius: 8, padding: 12 }}>
					<Text>{statValue}</Text>
				</View>
				<View
					style={{
						backgroundColor: theme.blueGrey,
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center",
						flex: 1,
						marginLeft: 8,
						overflow: "hidden",
					}}
				>
					<View
						style={{
							position: "absolute",
							overflow: "hidden",
							width: `${calculatePercentageWidth}%`,
							height: "100%",
							left: 0,
							backgroundColor: primaryColor,
						}}
					></View>
					<Text style={{ textAlign: "center" }} italic={statName == "Wishlist"}>
						{statName}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default UnitProgressCard;

const styles = StyleSheet.create({});
