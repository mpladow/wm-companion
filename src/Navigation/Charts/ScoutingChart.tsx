import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import { Styling } from "@utils/index";
import { ModalContainer, Text, TextBlock } from "@components/index";
import { margin } from "@utils/constants";
import fontSize from "@utils/styling";
import { useNavigation } from "@react-navigation/native";

const ScoutingChart = () => {
	const { theme } = useTheme();
	const navigation = useNavigation();
	return (
		<ModalContainer
			onPageModalClosePressed={() => navigation.goBack()}
			headerTitle={"Scouting"}
			footerRight={<Text>pg 82</Text>}
		>
			<>
				<View style={{ marginBottom: 12 }}>
					<TextBlock>
						<Text>
							Before the game starts, indicate which units an/or characters you wish to commit to
							scouting.
						</Text>
					</TextBlock>
					<TextBlock>
						<Text>Roll 2D6 and add this to the number of committed scouting points.</Text>
					</TextBlock>
					<TextBlock>
						<Text>Highest value chooses table side, then places all their committed scouting units.</Text>
					</TextBlock>
					<TextBlock>
						<Text>Opponent places all their units.</Text>
					</TextBlock>
					<TextBlock>
						<Text bold>The winner MUST move SECOND in the first turn.</Text>
					</TextBlock>
				</View>
				<View style={{ flexDirection: "row", paddingBottom: 4 }}>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								Role
							</Text>
						</TextBlock>
					</View>
					<View style={{ flex: 1 }}>
						<TextBlock>
							<Text bold style={{ fontSize: fontSize.lg }}>
								Scouting Points
							</Text>
						</TextBlock>
					</View>
				</View>
				<ScrollView style={{ display: "flex", flex: 1 }} showsVerticalScrollIndicator={false}>
					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										Flyers
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										3
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text style={{ fontSize: fontSize.md }}>
										flying units or flying chracter or character on flying mount:
									</Text>
									<Text italic>Rangers; Guter Runners; Gorgers; Waywatchers</Text>
								</TextBlock>
							</View>
						</View>
					</View>
					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 8 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										Scouts
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										2
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<>
										<Text style={{ fontSize: fontSize.md }}>
											Any unit of cavalry with 6+ armour
										</Text>
										<Text italic>
											Ethereal Host; Centigors, Warhounds; Hunstmen; Beastherd/Herdkin deployed as
											ambushers; Skirmishers; non-flying General
										</Text>
									</>
								</TextBlock>
							</View>
						</View>
					</View>

					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										Patrols
									</Text>
								</TextBlock>
							</View>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text bold style={{ fontSize: fontSize.md }}>
										1
									</Text>
								</TextBlock>
							</View>
						</View>
						<View style={{ flexDirection: "row", paddingBottom: 4 }}>
							<View style={{ flex: 1 }}>
								<TextBlock>
									<Text style={{ fontSize: fontSize.md }}>
										any unit of cavalry with zero or 5+ armour
									</Text>
									<Text italic>Rat Swarms; Skinks; non-flying command 8 character</Text>
								</TextBlock>
							</View>
						</View>
					</View>
				</ScrollView>
			</>
		</ModalContainer>
	);
};

export default ScoutingChart;
