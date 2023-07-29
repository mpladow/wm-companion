import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import fonts from "@utils/fonts";

type DropdownProps = {
	multiselect: boolean;
};
const dropdown = (props: any) => {
	return (<Dropdown
		{...props}
		// itemTextStyle={{ fontFamily: fonts.PTSansBold }}
        fontFamily={fonts.PTSansBold}
	/>)
};

export default dropdown;

const styles = StyleSheet.create({});
