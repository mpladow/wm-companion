import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Theme } from '@hooks/useTheme';
import fonts from '@utils/fonts';
import ThemedText from '@components/ThemedText.tsx/ThemedText';
import FormLabel from '@components/forms/FormLabel';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

type EditArmyV2Props = {
  armyName: string;
  factionNameError?: string;
  onArmyNameChange: (val: string) => void;
  armyNotes: string;
  armyNotesError?: string;
  onArmyNotesChange: (val: string) => void;
  theme: Theme;
};
const EditArmyV2 = ({
  armyName,
  onArmyNameChange,
  factionNameError,
  armyNotes,
  armyNotesError,
  onArmyNotesChange,
  theme,
}: EditArmyV2Props) => {
  const { t } = useTranslation(['builder', 'common', 'forms']);
  return (
    <View style={{ flexGrow: 1 }}>
      <Animated.View style={{ alignItems: 'center', height: 40 }} entering={FadeIn}>
        <ThemedText size="lg" bold>
          Army Details
        </ThemedText>
      </Animated.View>
      <TextInput
        placeholder={t('PlaceholderEnterArmyName', { ns: 'forms' })}
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
    </View>
  );
};

export default EditArmyV2;

const styles = StyleSheet.create({});
