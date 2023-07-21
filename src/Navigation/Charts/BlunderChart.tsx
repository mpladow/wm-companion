import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";

const BlunderChart = () => {
	const { theme } = useTheme();
	return (
		<ScrollView style={{ display: "flex", flex: 1 }} showsVerticalScrollIndicator={false}>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<TextBlock>
						<Text bold style={{ fontSize: fontSize.lg }}>
							1
						</Text>
					</TextBlock>
				</View>
				<View style={{ flex: 5 }}>
					<TextBlock>
						<Text bold italic  style={{ fontSize: fontSize.lg }}>
							You must be crazy!
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>
							The unit may not move and -1 Command Penalty to <Text bold>unit</Text> for the rest of the
							battle.
						</Text>
					</TextBlock>
					<TextBlock variant='small'>
						<Text>
							If a brigade has blundered then this penalty applies to one unit of the player's choosing.
						</Text>
					</TextBlock>
					<TextBlock variant='small'>
						<Text>This penalty is cumulative.</Text>
					</TextBlock>
				</View>
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<TextBlock>
						<Text bold style={{ fontSize: fontSize.lg }}>
							2-3
						</Text>
					</TextBlock>
				</View>
				<View style={{ flex: 5 }}>
					<TextBlock>
						<Text bold italic  style={{ fontSize: fontSize.lg }}>
							Blimey Sir! There's thousands of 'em!
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>
							The unit may not move and -1 Command Penalty to <Text bold>unit</Text> for the rest of the
							battle.
						</Text>
					</TextBlock>
					<TextBlock variant='small'>
						<Text>
							If a brigade has blundered then this penalty applies to one unit of the player's choosing.
						</Text>
					</TextBlock>
					<TextBlock variant='small'>
						<Text>This penalty is cumulative.</Text>
					</TextBlock>
				</View>
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<TextBlock>
						<Text bold  style={{ fontSize: fontSize.lg }}>
							4-5
						</Text>
					</TextBlock>
				</View>
				<View style={{ flex: 5 }}>
					<TextBlock>
						<Text bold italic  style={{ fontSize: fontSize.lg }}>
							No sense in getting killed sir!
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>The unit may not move this turn</Text>
					</TextBlock>
				</View>
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<TextBlock>
						<Text bold style={{ fontSize: fontSize.lg }}>
							6
						</Text>
					</TextBlock>
				</View>
				<View style={{ flex: 5 }}>
					<TextBlock>
						<Text bold italic style={{ fontSize: fontSize.lg }}>
							Up and at 'em, men!'
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>
							the unit must move at its maximum pace towards the nearest visible enemy unit, and will
							charge if possible.
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>
							If a brigade order is given, move each unit individually. The unit may not receive any
							futher orders this turn.{" "}
						</Text>
					</TextBlock>
				</View>
			</View>
		</ScrollView>
	);
};

export default BlunderChart;
