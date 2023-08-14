import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "@components/index";

type QuickviewProfileHeadingProps = {
	label: string;
};
const QuickviewProfileHeading = ({ label }: QuickviewProfileHeadingProps) => {
	return <Text bold style={{ fontSize: 12 }}>{label}</Text>;
};

export default QuickviewProfileHeading;

const styles = StyleSheet.create({});
