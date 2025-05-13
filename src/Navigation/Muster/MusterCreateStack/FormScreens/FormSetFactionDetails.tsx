import { Dimensions, FlatList, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Theme, useTheme } from '@hooks/useTheme';
import fonts from '@utils/fonts';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import FormLabel from '@components/forms/FormLabel';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Picker } from '@react-native-picker/picker';

type FormFactionDetailsProps = {
  armyName: string;
  faction: string;
  factionNameError?: string;
  onArmyNameChange: (val: string) => void;
  armyNotes: string;
  armyNotesError?: string;
  onArmyNotesChange: (val: string) => void;
  maxPoints: number;
  onMaxPointsChange: (val: number) => void;
  armyPointsBuffer: number;
  onArmyPointsBufferChange: (val: number) => void;
};
const FormFactionDetails = ({
  armyName,
  faction,
  onArmyNameChange,
  factionNameError,
  armyNotes,
  armyNotesError,
  onArmyNotesChange,
  maxPoints,
  onMaxPointsChange,
  armyPointsBuffer,
  onArmyPointsBufferChange,
}: FormFactionDetailsProps) => {
  const { t } = useTranslation(['builder', 'common', 'forms']);
  const { theme } = useTheme();
  return (
    <Animated.View
      entering={Platform.OS !== 'windows' ? FadeInLeft.delay(200) : undefined}
      exiting={Platform.OS !== 'windows' ? FadeOutRight.delay(200) : undefined}
      style={{ flexGrow: 1 }}>
      {/* <Animated.View style={{ alignItems: 'center', height: 40 }} entering={FadeIn}>
        <ThemedText size="lg" bold>
          Army Details
        </ThemedText>
      </Animated.View> */}
      {/* <BottomSheetTextInput
        value={armyName}
        onChangeText={(val) => onArmyNameChange(val)}
        style={[
          {
            color: theme.black,
            fontFamily: fonts.PTSansBold,
            fontSize: 16,
            backgroundColor: theme.white,
            borderRadius: 16,
            padding: 16,
          },
          factionNameError && { borderColor: theme.danger, borderWidth: 4 },
        ]}
      /> */}
      <View style={{ flexGrow: 1 }}>
        <KeyboardAwareScrollView
          enabled
          style={{
            height: Dimensions.get('screen').height / 1.7,
            maxHeight: Dimensions.get('screen').height / 1.7,
            flexGrow: 1,
          }}>
          <FormLabel label="Faction" />
          <ThemedText>{faction}</ThemedText>
          <FormLabel label={'Army Name'} />

          <TextInput
            placeholder={t('PlaceholderEnterArmyName', { ns: 'forms' })}
            value={armyName}
            onChangeText={(val) => onArmyNameChange(val)}
            style={[
              {
                color: theme.black,
                fontFamily: fonts.PTSansBold,
                fontSize: 20,
                backgroundColor: theme.white,
                borderRadius: 16,
                padding: 16,
                textAlign: 'center',
                alignItems: 'center',
              },
              factionNameError && { borderColor: theme.danger, borderWidth: 4 },
            ]}></TextInput>
          {factionNameError && (
            <ThemedText italic style={{ color: theme.danger }}>
              An army name is required
            </ThemedText>
          )}
          <FormLabel label={t('Notes', { ns: 'builder' })} />
          <TextInput
            multiline
            maxLength={200}
            value={armyNotes}
            onChangeText={(val) => onArmyNotesChange(val)}
            style={[
              {
                color: theme.black,
                fontFamily: fonts.PTSansBold,
                fontSize: 16,
                backgroundColor: theme.white,
                borderRadius: 16,
                padding: 16,
                paddingTop: 16,
                height: 100,
              },
              factionNameError && { borderColor: theme.danger, borderWidth: 4 },
            ]}
          />
          {/* <FormLabel label={'Maximum Points'} />
          <Picker
            itemStyle={{ color: theme.text, fontSize: 18 }}
            numberOfLines={1}
            selectedValue={maxPoints}
            onValueChange={(itemValue, itemIndex) => {
              onMaxPointsChange(itemValue);
            }}>
            <Picker.Item label="1000" value={1000} style={{ backgroundColor: 'blue' }} />
            <Picker.Item label="2000" value={2000} />
            <Picker.Item label="3000" value={3000} />
            <Picker.Item label="4000" value={4000} />
            <Picker.Item label="Dynamic" value={0} />
          </Picker> */}
          <FormLabel label="Points buffer allowance" />
          <View style={{ paddingBottom: 8 }}>
            <ThemedText italic>When your total points is within this threshold, the app will round up to the nearest 1000.</ThemedText>
          </View>
          <TextInput
            value={armyPointsBuffer.toString()}
            keyboardType="number-pad"
            onChangeText={(val) => onArmyPointsBufferChange(parseInt(val))}
            style={[
              {
                color: theme.black,
                fontFamily: fonts.PTSansBold,
                fontSize: 16,
                backgroundColor: theme.white,
                borderRadius: 16,
                padding: 16,
                paddingTop: 16,
              },
              factionNameError && { borderColor: theme.danger, borderWidth: 4 },
            ]}
          />
          {/* <FlatList
        data={[1000, 2000, 3000, 4000, 'custom']}
        scrollEnabled
        style={{ height: 100 }}
        renderItem={({ item, index }) => {
          return (
            <Pressable>
              <ThemedText>{item}</ThemedText>
            </Pressable>
          );
        }}
      /> */}
          <TextInput />
        </KeyboardAwareScrollView>
      </View>
    </Animated.View>
  );
};

export default FormFactionDetails;

const styles = StyleSheet.create({});
