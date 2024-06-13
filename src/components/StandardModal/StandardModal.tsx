import {
	Modal,
	StyleSheet,
	View,
	ModalProps,
	TouchableWithoutFeedback,
	Keyboard,
	Dimensions,
	Pressable,
	ScrollView,
} from "react-native";
import CustomText from "../CustomText";
import { useTheme } from "@hooks/useTheme";
import Button from "../button";
import IconButton from "../IconButton";
import { AntDesign } from "@expo/vector-icons";
import StandardModalHeader from "./StandardModalHeader";

export type StandardModalType = {
	content: React.ReactNode;
	heading: string;
	onSubmit?: () => void;
	onCancel: () => void;
	submitText?: string;
	cancelText?: string;
} & ModalProps;
const StandardModal = ({
	heading,
	content,
	onSubmit,
	onCancel,
	submitText,
	cancelText,
	...rest
}: StandardModalType) => {
	const { theme } = useTheme();
	return (
		<Modal animationType='fade' transparent={true} {...rest}>
			<View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", padding: 12 }}>
				<View style={styles.modalOverlay} onTouchStart={onCancel}></View>
				<View
					style={{
						marginTop: Dimensions.get("screen").height / 3.5,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: theme.blueGrey,
						padding: 16,
						margin: 12,
						borderRadius: 20,
						maxHeight: Dimensions.get("screen").height / 2,
					}}
				>
					<StandardModalHeader title={heading} onClose={onCancel} />
					<ScrollView showsVerticalScrollIndicator={true} style={{ paddingBottom: 24 }}>
						{content}
					</ScrollView>
					<View style={{ paddingTop: 8 }}>
						{onSubmit && (
							<Button onPress={onSubmit} variant={"confirm"}>
								<CustomText style={{ color: theme.textInverted }} bold>
									{submitText}
								</CustomText>
							</Button>
						)}

						{cancelText && (
							<Button onPress={onCancel} variant='text'>
								<CustomText>{cancelText}</CustomText>
							</Button>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
};
export default StandardModal;

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		//backgroundColor: 'blue',
		backgroundColor: "rgba(0,0,0,0.5)",
	},
});
