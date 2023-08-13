import {
	Alert,
	Dimensions,
	Modal,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { Text, TextBlock } from "@components/index";
import fontSize from "@utils/styling";
import Settings from "@navigation/Settings/screens/Settings";
import { Pages } from "@utils/constants";
import BlunderChart from "@navigation/Charts/BlunderChart";

type CustomModalProps = {
	setModalVisible: () => void;
	modalVisible: boolean;
	children?: JSX.Element;
	headerComponentRight?: JSX.Element;
	headerTitle?: string;
	footerLeft?: JSX.Element;
	footerRight?: JSX.Element;
	page?: string;
	onDismiss?: () => void;
};

export type ModalMetaContentType = {
	pageNumber?: string;
};

const CustomModal = ({
	setModalVisible,
	page,
	modalVisible,
	children,
	headerTitle,
	footerLeft,
	footerRight,
	onDismiss,
}: CustomModalProps) => {
	const windowWidth = Dimensions.get("window").width;
	const { theme } = useTheme();
	const [modalContent, setModalContent] = useState<JSX.Element | undefined>(<Settings />);
	const [modalHeader, setModalHeader] = useState<string | undefined>(headerTitle);

	const [loading, setLoading] = useState(false);
	const [modalMetaContent, setModalMetaContent] = useState<ModalMetaContentType>();
	useEffect(() => {
		setModalHeader(headerTitle);
	}, [headerTitle]);
	useEffect(() => {
		setLoading(true);
		if (page) {
			if (page == Pages.Settings) {
				// get additional data for this page
				setModalContent(<Settings />);
				setModalHeader("WM-Companion");
				setModalMetaContent(undefined);
			}
			if (page == Pages.Blunders) {
				setModalContent(<BlunderChart />);
				setModalHeader(Pages.Blunders);
				setModalMetaContent({ pageNumber: "pg 61" } as ModalMetaContentType);
			}
			setLoading(false);
		} else {
			setModalContent(undefined);
		}
	}, [page]);

	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={modalVisible}
			onDismiss={() => {
				onDismiss && onDismiss();
			}}
			onRequestClose={() => {
				setModalVisible();
			}}
		>
			<TouchableWithoutFeedback onPress={setModalVisible}>
				<View style={styles.modalOverlay} />
			</TouchableWithoutFeedback>
			<View style={styles.centeredView}>
				<View style={[styles.modalView, { width: windowWidth - 20, backgroundColor: theme.blueGrey }]}>
					<View style={{ flexDirection: "row", padding: 12 }}>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<View style={{ flex: 1, alignItems: "flex-start" }}></View>
							<View style={{ flex: 4, alignItems: "center" }}>
								<Text style={{ fontSize: fontSize.xxl, textAlign: "center" }} variant={"heading3"} bold>
									{modalHeader}
								</Text>
							</View>
							<View style={{ flex: 1, alignItems: "flex-end" }}>
								{/* <TouchableOpacity onPress={setModalVisible}>
									<AntDesign name='close' size={24} color={theme.text} />
								</TouchableOpacity> */}
							</View>
						</View>
					</View>
					<View style={{ padding: 12, paddingBottom: 60, flex: 1 }}>
						{modalContent ? modalContent : children}
					</View>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							alignItems: "flex-end",
							justifyContent: "center",
						}}
					>
						<View style={{ position: "absolute", left: 0, padding: 12 }}>{footerLeft}</View>
						<View
							style={{
								position: "absolute",
								top: -40,
								width: 70,
								height: 70,
								backgroundColor: theme.background,
								borderRadius: 200,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TouchableOpacity hitSlop={40} onPress={setModalVisible}>
								<AntDesign name='close' size={24} color={theme.text} />
							</TouchableOpacity>
						</View>
						<View style={{ position: "absolute", right: 0, padding: 12 }}>
							<Text>{modalMetaContent?.pageNumber}</Text>
						</View>
					</View>
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
		// paddingVertical: 40,
		// paddingHorizontal: 40,
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
