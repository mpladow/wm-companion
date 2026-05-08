import { Button, FactionImages, Text } from '@components/index';
import { useBuilderContext } from '@context/BuilderContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Factions } from '@utils/constants';
import { getKeyByValue } from '@utils/factionHelpers';
import fonts from '@utils/fonts';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

const EditArmy = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const builder = useBuilderContext();
  const toast = useToast();
  const { factionSelection, armyId } = route.params as { factionSelection: string; armyId: string };
  console.log('🚀 ~ EditArmy ~ armyId:', armyId);

  const currentArmy = builder.getArmyByArmyId(armyId);
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;

  // Keyboard visibility state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // form data
  const [factionNameError, setFactionNameError] = useState(false);
  const [factionName, setFactionName] = useState<string>(currentArmy?.name || '');
  const nameRef = useRef<TextInput>(null);
  const { t } = useTranslation(['builder', 'common', 'forms']);

  useEffect(() => {
    if (armyId !== null) {
      navigation.setOptions({ title: 'Edit Army' });
    } else {
      navigation.setOptions({ title: 'Finalise Army' });
    }
  }, []);

  const onConfirmEditArmyPress = async () => {
    if (factionName == '') {
      setFactionNameError(true);
    } else {
      setFactionNameError(false);
      builder.updateArmyName(factionName, armyId);
      // Navigate to BuilderEdit screen by resetting navigation stack
      (navigation as any).reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'ArmyBuilder',
              params: { screen: 'BuilderEdit' },
            },
          },
        ],
      });
      toast.show(`Army updated!`);
    }
  };
  const [createdArmyId, setCreatedArmyId] = useState<string | null>(null);

  const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
    if (factionName == '') {
      console.error('🚀 ~ onConfirmCreateArmyPress ~ factionName:', factionName);
      setFactionNameError(true);
    } else {
      setFactionNameError(false);
    }
    if (factionSelection && factionName != '') {
      builder
        .addUserArmyList(parseInt(factionSelection), factionName, autopopulate, CURRENT_VERSION)
        .then((result) => {
          console.log('🚀 ~ onConfirmCreateArmyPress ~ result:', result);
          setCreatedArmyId(result);
          builder.setSelectedArmyList(result);
        })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            // (navigation as any).navigate('BuilderEdit');
            toast.show(`New army created!`);
          }, 1000);
        });
    }
  };
  useEffect(() => {
    if (createdArmyId) {
      // army has been created - set the current army list
      builder.setSelectedArmyList(createdArmyId);
      (navigation as any).navigate('BuilderEdit');
    }
  }, [createdArmyId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{
          flex: isKeyboardVisible ? 0.6 : 1,
        }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <FactionImages factionId={parseInt(factionSelection)} />
        <View style={{ height: 2, backgroundColor: theme.white, width: '100%' }}></View>
        <KeyboardAvoidingView style={{ flex: 1, padding: 16 }}>
          <Text variant="heading3" style={{ marginBottom: 8, fontSize: 32 }}>
            {getKeyByValue(Factions, parseInt(factionSelection))}
          </Text>
          <TextInput
            ref={nameRef}
            placeholder={t('PlaceholderEnterArmyName', { ns: 'forms' })}
            onChangeText={(val) => setFactionName(val)}
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
            ]}>
            {factionName}
          </TextInput>
          {factionNameError && (
            <Text italic style={{ color: theme.danger }}>
              An army name is required
            </Text>
          )}
        </KeyboardAvoidingView>
        <View
          style={{
            paddingTop: 16,
            flexDirection: 'row',
            alignSelf: 'flex-end',
            gap: 12,
            padding: 16,
          }}>
          <View>
            <Button onPress={() => navigation.goBack()} variant={'secondary'}>
              <Text bold style={{ textTransform: 'uppercase', color: theme.white }}>
                Back
              </Text>
            </Button>
          </View>
          {armyId !== undefined ? (
            <View style={{ flex: 1 }}>
              <Button onPress={onConfirmEditArmyPress} variant={'confirm'}>
                <Text bold style={{ textTransform: 'uppercase', color: theme.black }}>
                  Update Army
                </Text>
              </Button>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Button
                disabled={factionName == null || factionName == ''}
                onPress={() => onConfirmCreateArmyPress(true)}
                variant={'confirm'}
                style={{ flexDirection: 'row', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={theme.black} />

                <Text bold style={{ textTransform: 'uppercase', color: theme.black }}>
                  Create Army
                </Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditArmy;

const styles = StyleSheet.create({});
