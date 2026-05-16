import FormLabel from '@components/forms/FormLabel';
import { Button, FactionImages, Text } from '@components/index';
import { useBuilderContext } from '@context/BuilderContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Factions } from '@utils/constants';
import { getKeyByValue } from '@utils/factionHelpers';
import fonts from '@utils/fonts';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Keyboard,
	KeyboardAvoidingView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

export type PointsLimitType = undefined | '1000' | '2000';
const EditArmy = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const builder = useBuilderContext();
  const toast = useToast();
  const { factionSelection, armyId } = route.params as { factionSelection: string; armyId: string };
  const currentArmy = builder.getArmyByArmyId(armyId);
  const CURRENT_VERSION = Constants.expoConfig?.extra?.armyVersion;
  const [pointsLimitSelection, setPointsLimitSelection] = useState<PointsLimitType>(
    currentArmy?.pointsLimit,
  );
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
  const [factionNotes, setFactionNotes] = useState<string>(currentArmy?.armyNotes);
  const [setFactionNotesError, setSetFactionNotesError] = useState();
  const [createdArmyId, setCreatedArmyId] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const { t } = useTranslation(['builder', 'common', 'forms']);

  useEffect(() => {
    if (armyId !== undefined) {
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
      if (factionNotes !== '') {
        setTimeout(() => {
          builder.updateArmyNotes(armyId, factionNotes);
        }, 500);
      }
      setTimeout(() => {
        builder.updatePointsLimit(armyId, pointsLimitSelection);
      }, 500);
      // Navigate to BuilderEdit screen by resetting navigation stack
      (navigation as any).reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'BuilderHome',
            },
          },
        ],
      });
      toast.show(`Army updated!`, { type: 'success' });
    }
  };

  const onConfirmCreateArmyPress = async (autopopulate: boolean) => {
    if (factionName == '') {
      console.error('🚀 ~ onConfirmCreateArmyPress ~ factionName:', factionName);
      setFactionNameError(true);
    } else {
      setFactionNameError(false);
    }
    if (factionSelection && factionName != '') {
      builder
        .addUserArmyList(
          parseInt(factionSelection),
          factionName,
          factionNotes,
          pointsLimitSelection,
          autopopulate,
          CURRENT_VERSION,
        )
        .then((result) => {
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

  const determineToggleStyle = useCallback(
    (value: any) => {
      if (value == pointsLimitSelection) {
        return { backgroundColor: theme.secondary };
      } else {
        return { backgroundColor: theme.grey3 };
      }
    },
    [pointsLimitSelection],
  );
  const onPointsLimitSelection = (value: PointsLimitType) => {
    setPointsLimitSelection(value);
  };

  const renderPointsLimitDetails = useCallback(() => {
    if (pointsLimitSelection == undefined) {
      return `${t('BuilderDefaultPointsRestrictions')}`;
    }
    if (pointsLimitSelection == '1000') {
      return `${t('BuilderPointsRestrictions')}`;
    }
    if (pointsLimitSelection == '2000') {
      return `${t('BuilderPointsRestrictions')}`;
    }
  }, [pointsLimitSelection]);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingBottom: insets.bottom }}>
      <ScrollView
        style={{
          flex: isKeyboardVisible ? 0.6 : 1,
        }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <FactionImages factionId={parseInt(factionSelection)} />
        <View style={{ height: 2, backgroundColor: theme.white, width: '100%' }}></View>
        <KeyboardAvoidingView style={{ flex: 1, padding: 16 }}>
          <Text variant="heading3" style={{ marginBottom: 8, fontSize: 32 }}>
            {getKeyByValue(Factions, parseInt(factionSelection))?.replace('_', ' ')}
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
          <FormLabel label={t('Notes', { ns: 'builder' })} />
          <TextInput
            multiline
            maxLength={150}
            value={factionNotes}
            onChangeText={(val) => setFactionNotes(val)}
            style={[
              {
                color: theme.black,
                fontFamily: fonts.PTSansBold,
                fontSize: 16,
                backgroundColor: theme.white,
                borderRadius: 16,
                padding: 16,
                paddingTop: 16,
                height: 80,
              },
              factionNameError && { borderColor: theme.danger, borderWidth: 4 },
            ]}
          />
          <FormLabel label={'Points Limit'} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => onPointsLimitSelection(undefined)}
                style={[styles.pointsCostToggle, determineToggleStyle(undefined)]}>
                <Text>Dynamic</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => onPointsLimitSelection('1000')}
                style={[styles.pointsCostToggle, determineToggleStyle('1000')]}>
                <Text>1000</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => onPointsLimitSelection('2000')}
                style={[styles.pointsCostToggle, determineToggleStyle('2000')]}>
                <Text>2000</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingTop: 8, alignItems: 'center' }}>
            <Text>{renderPointsLimitDetails()}</Text>
          </View>
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
    </View>
  );
};

export default EditArmy;

const styles = StyleSheet.create({
  pointsCostToggle: {
    padding: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `0px 0px 12px 8px rgba(0, 0, 0, 0.20)`,
  },
});
