import { useTheme } from "@hooks/useTheme";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
export const AppHeader = ({ value, children }: { value: Animated.Value; children: React.ReactNode }) => {
	const { theme } = useTheme();
	const HEADER_MAX_HEIGHT = 90;
	const HEADER_MIN_HEIGHT = 60;
	const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
	const animatedHeaderHeight = value.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: "clamp",
	});
	const animatedOpacity = value.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});
	console.log("🚀 ~ AnimatedHeader ~ animatedHeaderHeight:", animatedHeaderHeight);
	return (
		<Animated.View style={[{ height: animatedHeaderHeight }, { backgroundColor: "transparent" }]}>
			{children}
		</Animated.View>
	);
};
export const AnimatedHeader = ({ value, children }: { value: Animated.Value; children: React.ReactNode }) => {
	const HEADER_MAX_HEIGHT = 80;
	const HEADER_MIN_HEIGHT = 0;
	const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
	const animatedHeaderHeight = value.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: "clamp",
	});
	const animatedOpacity = value.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});
	console.log("🚀 ~ AnimatedHeader ~ animatedHeaderHeight:", animatedHeaderHeight);
	return <Animated.View style={[{ height: animatedHeaderHeight }]}>{children}</Animated.View>;
};
export default AnimatedHeader;
