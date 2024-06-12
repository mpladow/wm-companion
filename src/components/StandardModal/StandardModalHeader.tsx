import CustomText from "@components/CustomText";
import { AntDesign } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useTheme } from "@hooks/useTheme";

type StandardModalHeaderTypes = { title: string; onClose: () => void };
const StandardModalHeader = ({ title, onClose }: StandardModalHeaderTypes) => {
	const { theme } = useTheme();
	return (
		<View style={{ flexDirection: "row", width: "100%", justifyContent: "center", paddingBottom: 24 }}>
			<View style={{ justifyContent: "center", alignSelf: "center", alignContent: "center" }}>
				<CustomText variant='heading1' style={{ fontSize: 20 }}>
					{title}
				</CustomText>
			</View>
			<View style={{ position: "absolute", right: 0 }}>
				<Pressable hitSlop={40} onPress={onClose}>
					<AntDesign name='close' size={24} color={theme.text} />
				</Pressable>
			</View>
		</View>
	);
};
export default StandardModalHeader;
