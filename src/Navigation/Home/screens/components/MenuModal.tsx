import { Animated, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";

export type MenuOptions = {
	label: string;
	onPress?: () => void;
	icon: ReactElement;
};
type MenuModalProps = {
	options: MenuOptions[];
	visible: boolean;
	onDismiss: () => void;
	handleMenuPress: () => void;
};
const MenuModal = ({ options, visible, onDismiss, handleMenuPress }: MenuModalProps) => {
	const [height] = useState(new Animated.Value(0));
	const [scale] = useState(new Animated.Value(0));
	const [fadeAnimation] = useState(new Animated.Value(1));
	const { theme } = useTheme();

	const DROPDOWN_HEIGHT = 300;

	// fade animation
	useEffect(() => {
		Animated.timing(fadeAnimation, {
			toValue: visible ? 0 : 1,
			duration: 1200,
			useNativeDriver: true,
		}).start();
	}, [visible]);

	//height of menu
	useEffect(() => {
		console.log(visible, "visible");
		Animated.timing(height, {
			toValue: visible ? DROPDOWN_HEIGHT : 0,
			duration: 500,
			useNativeDriver: false,
		}).start();
		Animated.timing(scale, {
			toValue: visible ? 0 : 1,
			duration: 500,
			useNativeDriver: false,
		}).start();
	}, [visible]);

	// const [dropdownTop, setDropdownTop] = useState(0);

	const dropdownButton = useRef<View>(null);
	const onMenuPress = (): void => {
		console.log("-----");
		console.log("Open and close dropdown");
		// dropdownButton?.current?.measure((_fx, _fy, _w, h, _px, py) => {
		// 	setDropdownTop(h / 2);
		// });
		handleMenuPress();
	};

	return (
		<Pressable onPress={onMenuPress} ref={dropdownButton} style={{ overflow: "visible" }}>
			<Animated.View
				style={{
					opacity: fadeAnimation,
				}}
			>
				<Entypo name='menu' size={32} color={theme.text} />
			</Animated.View>
			<Animated.View
				onTouchEnd={onMenuPress}
				style={[
					{ height: height, top: 5, backgroundColor: theme.black },
					{
						transform: [
							{
								translateY: scale.interpolate({
									inputRange: [0, 1],
									outputRange: [-150, 0],
								}),
							},
						],
					},
					styles.dropdown,
				]}
			>
				{options.map((x, index) => (
					<TouchableOpacity
						key={index}
						style={{ padding: 8, paddingVertical: 12 }}
						onPress={x.label == "Close" ? onMenuPress : x.onPress}
					>
						{x.icon}
					</TouchableOpacity>
				))}
			</Animated.View>
		</Pressable>
	);
};

export default MenuModal;

const styles = StyleSheet.create({
	dropdown: {
		borderRadius: 25,
		justifyContent: "space-evenly",
		overflow: "hidden",
		alignItems: "center",
		position: "absolute",
		width: 70,
		right: -10,
		shadowColor: "#000000",
		shadowRadius: 4,
		shadowOffset: { height: 4, width: 0 },
		shadowOpacity: 0.5,
	},
});
