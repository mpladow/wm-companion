import { useBuilderContext } from '@context/BuilderContext';
import { Entypo, Foundation } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { generateHtml } from '@navigation/Builder/utils/exporterHelpers';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Alert,
	Platform,
	Pressable,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useToast } from 'react-native-toast-notifications';

const QuickviewHeaderMenu = ({ html, onCopyPress }: { html?: string; onCopyPress: any }) => {
  const navigation = useNavigation();
  const [showPopover, setShowPopover] = useState(false);
  const { theme } = useTheme();
  const builder = useBuilderContext();
  const toast = useToast();
  const { t } = useTranslation(['builder', 'common']);

  const handleGenerateExport = async () => {
    console.log('🚀 ~ handleGenerateExport ~ builder.selectedArmyList :', builder.selectedArmyList);
    if (builder.selectedArmyList && builder.factionDetails) {
      try {
        const html = generateHtml(
          builder.selectedArmyList,
          builder.factionDetails,
          builder.calculateCurrentArmyPoints(),
          builder.getUnitCounts(),
        );
        setTimeout(async () => {
          const { uri } = await Print.printToFileAsync({ html });
          if (Platform.OS == 'ios') {
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
          } else {
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

            // const permission = await MediaLibrary.requestPermissionsAsync();
            // if (permission.granted) {
            // 	// await MediaLibrary.createAssetAsync(uri);
            //     Print.printToFileAsync
            //     FileSystem.downloadAsync(uri, FileSystem.documentDirectory + builder.selectedArmyList.name)
            // }
          }
        }, 500);
      } catch (e) {
        console.error(e, 'ERROR');
      }
    }
  };

  const handleShare = async () => {
    if (html) {
      setTimeout(async () => {
        try {
          const result = await Share.share({
            title: `${builder.selectedArmyList?.name} - ${builder.selectedArmyList?.faction}`,
            message: html,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error: any) {
          Alert.alert(error.message);
        }
      }, 500);
    }
  };

  const [printer, setPrinter] = useState<Print.Printer>();
  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setPrinter(printer);
  };
  return (
    <Popover
      isVisible={showPopover}
      placement={PopoverPlacement.BOTTOM}
      onRequestClose={() => setShowPopover(false)}
      popoverStyle={{ borderRadius: 24 }}
      arrowSize={{ width: 0, height: 0 }}
      onOpenStart={() => console.log('OPENING')}
      from={
        <Pressable onPress={() => setShowPopover(true)}>
          <Entypo name="dots-three-vertical" size={20} color={theme.text} />
        </Pressable>
      }>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          maxWidth: 200,
          backgroundColor: theme.blueGrey,
          flex: 1,
          borderRadius: 24,
          overflow: 'hidden',
          gap: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            onCopyPress();
          }}
          style={[
            { flex: 1, flexDirection: 'row', paddingVertical: 8, backgroundColor: theme.blueGrey },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <Foundation name="page-copy" size={20} color={theme.text} />
          </View>
          <Text style={{ color: theme.text }}>{t('CopyText')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            handleGenerateExport();
          }}
          style={[
            { flex: 1, flexDirection: 'row', paddingVertical: 8, backgroundColor: theme.blueGrey },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <Foundation name="page-export-pdf" size={20} color={theme.text} />
          </View>
          <Text style={{ color: theme.text }}>{t('GeneratePdf')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowPopover(false);
            handleShare();
          }}
          style={[
            { flex: 1, flexDirection: 'row', paddingVertical: 8, backgroundColor: theme.blueGrey },
            styles.menuButtons,
          ]}>
          <View style={{ marginRight: 8 }}>
            <Entypo name="share" size={20} color={theme.text} />
          </View>
          <Text style={{ color: theme.text }}>{t('Share')}</Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
};

export default QuickviewHeaderMenu;

const styles = StyleSheet.create({
  image: {
    //  justifyContent: 'center',
    //  top: 0,
    minHeight: 16,
  },
  menuButtons: {
    paddingLeft: 12,
    paddingRight: 44,
    borderRadius: 16,
    minHeight: 40,
    alignItems: 'center',
  },
});
