import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";

type AnimatedViewProps = {
	children: JSX.Element;
	animationCallback?: any;
	animate: boolean;
};
const AnimatedView = ({ children, animate }: AnimatedViewProps) => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		console.log("SCALE UP");
		scaleUp();
	}, [animate]);
	const scaleUp = () => {
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.1,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};
	return <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>{children}</Animated.View>;
};

export default AnimatedView;

const styles = StyleSheet.create({});
