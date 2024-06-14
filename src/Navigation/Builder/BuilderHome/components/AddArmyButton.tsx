import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text } from "@components/index";
import { Theme } from "@hooks/useTheme";

const AddArmyButton = ({
	handleAddArmyPress,
	theme,
	buttonName,
}: {
	handleAddArmyPress: () => void;
	theme: Theme;
	buttonName: string;
}) => {
	return (
		<View style={{ zIndex: 99999, position: "absolute", bottom: 30, right: 24 }}>
			{/* <Button circle onPress={handleAddArmyPress} variant={"confirm"}>
                <AntDesign name='plus' size={24} color='black' />
            </Button> */}
			<Button onPress={handleAddArmyPress} variant={"confirm"}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<AntDesign name='plus' size={20} color='black' />
					<Text bold style={{ marginLeft: 4, color: theme.black }}>
						{buttonName}
					</Text>
				</View>
			</Button>
		</View>
	);
};
export default AddArmyButton;
