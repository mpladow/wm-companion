import { Alert, Dimensions, Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";

type CustomModalProps = {
	setModalVisible: () => void;
	modalVisible: boolean;
	children?: JSX.Element;
};

const CustomModal = ({ setModalVisible, modalVisible, children }: CustomModalProps) => {
	const windowWidth = Dimensions.get("window").width;
    const {theme} = useTheme();

	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				setModalVisible();
			}}
		>
			<TouchableWithoutFeedback onPress={setModalVisible}>
				<View style={styles.modalOverlay} />
			</TouchableWithoutFeedback>
			<View style={styles.centeredView}>
				<View style={[styles.modalView, { width: windowWidth - 40, backgroundColor:  theme.background}]}>
					<>
						<View style={{ position: "absolute", right: 0, flexDirection: "row", padding: 20 }}>
							<Pressable onPress={setModalVisible}>
								<AntDesign name='close' size={24} color={theme.text} />
							</Pressable>
						</View>
						{children}
					</>
				</View>
			</View>
		</Modal>
	);
};

export default CustomModal;

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// marginTop: 22,
	},
	modalView: {
		flex: 1,
		margin: 50,
		backgroundColor: "white",
		borderRadius: 20,
		paddingVertical: 40,
        paddingHorizontal: 40,
		//alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
