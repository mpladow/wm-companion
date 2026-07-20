import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { IconImageProps } from "./types";
import UnitIconContainer from './UnitIconContainer';

const General = ({ size, color, isUnique }: IconImageProps) => {
  return (
    <UnitIconContainer isLeader={true} isUnique={isUnique}>
      <FontAwesome name="star" size={size} color={color} />
    </UnitIconContainer>
  );
};

export default General;

const styles = StyleSheet.create({});
