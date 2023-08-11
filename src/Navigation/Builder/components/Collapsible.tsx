import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

type CollapsibleProps = {
    headerLeftComponent: JSX.Element,
    collapsableContent: JSX.Element

}
const CollapsibleComponent = ({headerLeftComponent, collapsableContent}: CollapsibleProps) => {
    const [toggleVisible, setToggleVisible] = useState(true)
    const {theme} = useTheme();
	return (
		<View style={{ padding: 12, margin: 12, borderRadius: 12, backgroundColor: theme.white }}>
			<TouchableOpacity onPress={() => setToggleVisible(!toggleVisible)}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
						<View style={{ marginRight: 4 }}>
							<Feather name='book-open' size={20} color='black' />
						</View>
						<Text bold style={{ color: theme.black }}>
							{title}
						</Text>
					</View> */}
                    {headerLeftComponent}
					<View>
						{!toggleVisible ? (
							<AntDesign name='caretup' size={12} color='black' />
						) : (
							<AntDesign name='caretdown' size={12} color='black' />
						)}
					</View>
					{/*Heading of Single Collapsible*/}
				</View>
			</TouchableOpacity>

			<Collapsible collapsed={toggleVisible} align='center'>
				{collapsableContent}
				{/* <View style={{ paddingVertical: 4, paddingTop: 8 }}>{contents}</View> */}
			</Collapsible>
		</View>
	);
};

export default CollapsibleComponent;

const styles = StyleSheet.create({});
