import { Animated, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";

type ExpandableViewProps = {
	expanded: boolean;
	children: ReactNode;
	style?: ViewStyle;
};

const ExpandableView = ({ expanded, children, style }: ExpandableViewProps) => {
	const [height] = useState(new Animated.Value(0));
	useEffect(() => {
		Animated.timing(height, {
			toValue: !expanded ? 200 : 0,
			duration: 150,
			useNativeDriver: false,
		}).start();
	}, [expanded, height]);

	return (
		<Animated.View
			style={[style, 
				{
                    overflow: 'visible',
                    zIndex: 99,
					height: height,
					display: "flex",
                    flex: 1,
					flexDirection: "column",
					justifyContent: "center",
					width: 50,
					backgroundColor: "blue",
				},
			]}
		>
			{children}
		</Animated.View>
	);
};

export default ExpandableView;
