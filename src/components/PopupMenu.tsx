import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Text } from "@components/index";
import { SafeAreaView } from "react-native-safe-area-context";

export type PopupMenuOptionProps = {
	title: string;
	icon: JSX.Element;
	action: () => void;
};
type PopupMenuProps = {
	showOptions: boolean;
	menuIcon: JSX.Element;
	options: PopupMenuOptionProps[];
};
const PopupMenu = ({ menuIcon, options }: PopupMenuProps) => {
	const [showOptions, setShowOptions] = useState(false);
	const buttonRef = useRef<TouchableOpacity>(null);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	useLayoutEffect(() => {
		console.log("measuring");
		buttonRef.current?.measure((fx, fy, width, height, px, py) => {
			setY(py);
            setX(px)
		});
	}, []);
	const measurePosition = () => {
		console.log("measuring");
		buttonRef.current?.measure((fx, fy, width, height, px, py) => {
			setY(py);
		});
	};
	return (
		<>
			<TouchableOpacity onLayout={measurePosition} ref={buttonRef} onPress={() => setShowOptions(!showOptions)}>
				{menuIcon}
			</TouchableOpacity>
			<Modal visible={showOptions} transparent={true}>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: "transparent" }}
					onTouchStart={() => setShowOptions(false)}
				>
					<View style={[styles.dropdown, { top: y, left: x }]}>
						{options.map((op, i) => (
							<TouchableOpacity>
								<Text>{op.icon}</Text>
								<Text>{op.title}</Text>
							</TouchableOpacity>
						))}
					</View>
				</SafeAreaView>
			</Modal>
		</>
	);
};

export default PopupMenu;

const styles = StyleSheet.create({
	dropdown: {
		position: "absolute",
		top: 0,
		borderRadius: 8,
	},
});
