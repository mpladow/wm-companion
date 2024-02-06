import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import ModalContainer from "@components/ModalContainer";
import { useNavigation } from "@react-navigation/native";
import TextBlock from "@components/TextBlock";
import { useTheme } from "@hooks/useTheme";
import {Text} from "@components/index";
import Constants from "expo-constants";

const UpdatesModal = () => {
    const navigation = useNavigation();
    const {theme} = useTheme();
	const version = Constants?.expoConfig?.version;

	return (
		<ModalContainer onPageModalClosePressed={() => navigation.goBack()} headerTitle={"Information"} rotateContainer={false}>
			<View style={{ display: "flex", flex: 1, backgroundColor: theme.black, padding: 8 }}>
				<View style={{ justifyContent: "space-evenly" }}>
					<View style={{ marginVertical: 4 }}>
						<TextBlock>
							<>
								<Text bold>{version}</Text>
								<Text bold>
									This is an alpha build with additional functionality being added over time.
								</Text>
							</>
						</TextBlock>

					</View>

				</View>
			</View>
		</ModalContainer>
	);
};

export default UpdatesModal;

const styles = StyleSheet.create({});
