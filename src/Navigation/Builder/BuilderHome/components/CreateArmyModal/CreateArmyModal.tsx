import CustomModal from "@components/CustomModal";
import { ArmyListProps } from "@context/BuilderContext";
import { Theme } from "@hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import CreateArmyForm from "./components/CreateArmyForm";
import EditArmyForm from "./components/EditArmyForm";

type CreateArmyModalType = {
	onDismissCreateArmyModal: () => void;
	theme: Theme;
	isVisible: boolean;
	focusedArmy?: ArmyListProps;
};

const CreateArmyModal = ({ isVisible, theme, focusedArmy, onDismissCreateArmyModal }: CreateArmyModalType) => {
	const { t } = useTranslation(["builder", "common", "forms"]);

	return (
		<CustomModal
			onDismiss={onDismissCreateArmyModal}
			setModalVisible={onDismissCreateArmyModal}
			headerTitle={focusedArmy ? t("EditArmy") : t("CreateArmy")}
			modalVisible={isVisible}
		>
			<View style={{ flex: 1, flexDirection: "column", padding: 12 }}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<View style={{ flex: 1, justifyContent: "space-between" }}>
							{!focusedArmy ? (
								<CreateArmyForm theme={theme} handleDismissModal={onDismissCreateArmyModal} />
							) : (
								<EditArmyForm
									theme={theme}
									focusedArmy={focusedArmy}
									onDismiss={onDismissCreateArmyModal}
								/>
							)}
						</View>
					</>
				</TouchableWithoutFeedback>
			</View>
		</CustomModal>
	);
};
export default CreateArmyModal;
