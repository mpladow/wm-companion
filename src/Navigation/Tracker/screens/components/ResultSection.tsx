import { Animated, Easing, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ResultProps } from "@utils/types";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSettingsContext } from "@context/SettingsContext";
import { useTranslation } from "react-i18next";

type ResultSectionProps = {
	isTwoPlayerMode: boolean;
	resultOne?: ResultProps;
	resultTwo?: ResultProps;
};
const ResultSection = ({ resultOne, resultTwo }: ResultSectionProps) => {
	const { settings } = useSettingsContext();
	const { theme } = useTheme();
	const { t } = useTranslation("tracker");

	const resultOneStyle = useMemo(() => {
		switch (resultOne?.result) {
			case "Victory":
				return theme.success;
			case "Draw":
				return theme.disabled;
			case "Defeat":
				return theme.error;
			default:
				break;
		}
	}, [resultOne]);
	const resultTwoStyle = useMemo(() => {
		console.log(resultTwo?.result, "result");
		switch (resultTwo?.result) {
			case "Victory":
				return theme.success;
			case "Draw":
				return theme.disabled;
			case "Defeat":
				return theme.error;
			default:
				break;
		}
	}, [resultTwo]);

	const ANIMATION_DURATION = 500;
	const ANIMATION_SCALE_MAX = 1.2;
	const [scaleOne] = useState(new Animated.Value(1));
	useEffect(() => {
		let toValue = 1;
		if (resultOne?.result == "Victory") {
			toValue = ANIMATION_SCALE_MAX;
		}
		if (resultOne?.result == "Draw" || resultOne?.result == "Defeat") {
			toValue = 1;
		}
		Animated.timing(scaleOne, {
			toValue: toValue,
			duration: ANIMATION_DURATION,
			easing: Easing.bounce,
			useNativeDriver: false,
		}).start();
	}, [resultTwo?.result]);

	const [scaleTwo] = useState(new Animated.Value(1));
	useEffect(() => {
		let toValue = 1;
		if (resultTwo?.result == "Victory") {
			toValue = ANIMATION_SCALE_MAX;
		}
		if (resultTwo?.result == "Draw" || resultTwo?.result == "Defeat") {
			toValue = 1;
		}
		Animated.timing(scaleTwo, {
			toValue: toValue,
			duration: ANIMATION_DURATION,
			easing: Easing.bounce,
			useNativeDriver: false,
		}).start();
	}, [resultTwo?.result]);
	return (
		<>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<Animated.View
					style={[
						{ justifyContent: "center", alignItems: "center", flexDirection: "row" },
						{
							transform: [
								{ rotate: settings.trackerTwoPlayerMode ? "0deg" : "180deg" },
								{ scaleX: scaleOne },
								{ scaleY: scaleOne },
							],
						},
					]}
				>
					{resultOne?.result === "Victory" ? (
						<View style={{ paddingRight: 4 }}>
							<FontAwesome5 name='fist-raised' size={24} color={theme.success} />
						</View>
					) : null}
					<Text style={{ fontSize: 20, color: resultOneStyle }}>
						{`${t(resultOne?.result)} ${resultOne?.diff}`}
					</Text>
				</Animated.View>
				<Animated.View
					style={[
						{ transform: [{ scaleX: scaleTwo }, { scaleY: scaleTwo }] },
						{ justifyContent: "center", alignItems: "center", flexDirection: "row" },
					]}
				>
					{resultTwo?.result === "Victory" ? (
						<View style={{ paddingRight: 4 }}>
							<FontAwesome5 name='fist-raised' size={24} color={theme.success} />
						</View>
					) : null}
					<Text
						bold={resultTwo?.result == "Victory" && true}
						style={[{ fontSize: 20, color: resultTwoStyle }]}
					>
						{`${t(resultTwo?.result)} ${resultTwo?.diff}`}
					</Text>
				</Animated.View>
			</View>
		</>
	);
};

export default ResultSection;

const styles = StyleSheet.create({});
