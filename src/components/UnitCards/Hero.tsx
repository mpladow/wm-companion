import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { IconImageProps } from "./types";


const Hero = ({ size, color }: IconImageProps) => {
	return (
		<View
			style={{
				width: 28,
				height: 28,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#e3d9bc",
				padding: 0,
			}}
		>
            <FontAwesome name="star-half-empty" size={size} color={color} />
			{/* <Entypo name='star' size={size} color={color} /> */}
		</View>
	);
};

export default Hero;

const styles = StyleSheet.create({});
