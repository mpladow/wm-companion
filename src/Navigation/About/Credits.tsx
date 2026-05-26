import MainContainerWithImage from '@components/MainContainerWithImage';
import { Text, TextBlock } from '@components/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const Credits = () => {
  const { t } = useTranslation(['home', 'common']);
  return (
    <MainContainerWithImage>
      <View
        style={{
          flex: 1,
          zIndex: 9,
          justifyContent: 'center',
          padding: 12,
          paddingTop: 0,
        }}>
        <View
          style={{
            alignSelf: 'center',
            borderRadius: 8,
            borderWidth: 3,
            borderColor: 'black',
            marginBottom: 12,
          }}>
          <Image
            style={{ resizeMode: 'cover', width: Dimensions.get('screen').width - 30, height: 200 }}
            source={require('../../../assets/images/wm-bg2.jpeg')}
          />
        </View>
        <TextBlock variant="large">
          <Text>{t('GeneralThanks')}</Text>
        </TextBlock>
        <TextBlock variant="large">
          <Text>
            <Text bold>{t('SpecialMentionsForSculptors')}</Text>: Forest Dragon Miniatures, Onmioji,
            Greenskin Miniatures, GW, Wakes Emporium
          </Text>
        </TextBlock>
        <TextBlock variant="large">
          <Text>
            <Text bold>{t('SpecialMentionsForImages')}</Text>: Bornabairn, K Rauff, Przemas Bak,
            Gecko.Goblin, Graf, Hobbes, Hardy, Alexander Carraro, Mattias R, Byron L, Kristoffer
            Rauff, Geoff A, Kai Tek Ng, Mattias R, Darios
          </Text>
        </TextBlock>
        <TextBlock variant="large">
          <Text>
            <Text bold>Testing Team</Text>: <Text>Hroch, Graf, doomedtrooper</Text>
          </Text>
        </TextBlock>
        <TextBlock variant="large">
          <Text>
            <Text bold>{t('SpecialMentionsTranslations')}</Text>: Chus
          </Text>
        </TextBlock>
      </View>
    </MainContainerWithImage>
  );
};

export default Credits;

const styles = StyleSheet.create({});
