import { Modal, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@hooks/useTheme";
import Button from "./button";
import {Text} from '@components/index'

type PopupConfirmProps = {
	visible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	text: JSX.Element;
	confirmText: string;
	cancelText: string;
};
const PopupConfirm = ({ onConfirm, onCancel, text, confirmText, cancelText, visible }: PopupConfirmProps) => {
	const { theme } = useTheme();
	return (
		<Modal animationType='fade' visible={visible} transparent={true}>
			<View style={styles.modalOverlay} onTouchStart={() => onCancel()}></View>
			<View
				style={{
					marginTop: 400,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.blueGrey,
					padding: 16,
					margin: 12,
					borderRadius: 20,
				}}
			>
				<View style={{padding: 20}}>{text}</View>
				<View style={{ flexDirection: "column" }}>
					<Button onPress={() => onConfirm()} variant={"danger"}>
						<Text bold>{confirmText}</Text>
					</Button>
					<Button variant={"text"} onPress={() => onCancel()}>
						<Text style={{ color: theme.white }}>{cancelText}</Text>
					</Button>
				</View>
			</View>
		</Modal>
	);
};

export default PopupConfirm;

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		//backgroundColor: 'blue',
		backgroundColor: "rgba(0,0,0,0.1)",
	},
});
