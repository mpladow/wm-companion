import MenuOptionButton from "@components/MenuOptionButton";
import { ArmyListFilters, ListSections } from "@context/BuilderContext";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { View } from "react-native";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { Text } from "@components/index";

const ArmyListFilter = ({
	filters,
	handleFilterChange,
	listTarget,
}: {
	filters: ArmyListFilters[];
	handleFilterChange: (filter: ArmyListFilters, target: ListSections) => void;
	listTarget: ListSections;
}) => {
	const { theme } = useTheme();
	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			{filters.length > 0 && (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 50,
						backgroundColor: theme.accent,
						width: 20,
						height: 20,
					}}
				>
					<Text style={{ color: theme.textInverted }} bold>
						{filters.length}
					</Text>
				</View>
			)}
			<Menu style={{ zIndex: 99 }}>
				<MenuTrigger>
					<MaterialCommunityIcons name='filter-menu' size={24} color={theme.text} />
				</MenuTrigger>
				<MenuOptions
					optionsContainerStyle={{
						borderRadius: 8,
						maxWidth: 170,
						backgroundColor: theme.blueGrey,
					}}
				>
					<MenuOption disableTouchable>
						<View style={{ paddingHorizontal: 4 }}>
							<Text bold>Filters</Text>
						</View>
					</MenuOption>
					<MenuOption onSelect={() => handleFilterChange("all", listTarget)}>
						<MenuOptionButton
							icon={
								filters.find((x) => x == "all") ? (
									<Feather name='eye-off' size={24} color={theme.accent} />
								) : (
									<Feather name='eye' size={24} color={theme.text} />
								)
							}
							variant={"outline"}
							ButtonText={
								filters.find((x) => x == "all") ? "Exclude old army versions" : "Show all army versions"
							}
						/>
					</MenuOption>
				</MenuOptions>
			</Menu>
		</View>
	);
};
export default ArmyListFilter;
