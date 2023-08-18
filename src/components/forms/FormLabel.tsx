import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "@components/index";

type FormLabelProps = {
	label: string;
};
const FormLabel = ({ label }: FormLabelProps) => {
	return (
		<View style={{marginVertical: 8}}>
			<Text variant="heading3" bold style={{fontSize: 16}}>{label}</Text>
		</View>
	);
};

export default FormLabel;

const styles = StyleSheet.create({});
