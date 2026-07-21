import React from 'react';
import reactStringReplace from 'react-string-replace';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { asterixRegex, asterixSingleRegex, underscoreRegex } from '@utils/constants';
import type { Change, ChangeLog, ChangeLogImage } from 'src/types/data/changelog';
import Text from './CustomText';

type ChangelogContentProps = {
  changelog?: ChangeLog;
};

const CHANGELOG_IMAGES: Record<ChangeLogImage['source'], ImageSourcePropType> = {
  'gotrek_felix_01.png': require('../../assets/images/gotrek_felix_01.png'),
};

const CHANGELOG_IMAGE_HEIGHT = Math.min(220, Dimensions.get('screen').height * 0.22);

const ChangelogContent = ({ changelog }: ChangelogContentProps) => {
  const { theme } = useTheme();

  const sanitizeText = (text: string) => {
    let cleanText = text;
    cleanText = cleanText.replaceAll(',,', '\n');
    cleanText = cleanText.replaceAll('-|-', '-----');
    cleanText = cleanText.replaceAll('|', '\t');

    let sanitized = reactStringReplace(cleanText, underscoreRegex, (match, i) => {
      return (
        <Text bold style={{ color: theme.text, fontSize: 16 }} key={i}>
          {match}
        </Text>
      );
    });
    sanitized = reactStringReplace(sanitized, asterixRegex, (match, i) => {
      return (
        <Text italic style={{ color: theme.text }} key={i}>
          {match}
        </Text>
      );
    });
    sanitized = reactStringReplace(sanitized, asterixSingleRegex, (match, i) => {
      return (
        <Text italic style={{ color: theme.text }} key={i}>
          {match}
        </Text>
      );
    });

    return sanitized;
  };

  const getFontStyle = (change: Change): { color: string; fontSize: number } => {
    switch (change.type) {
      case 'overhaul':
        return { color: theme.accent, fontSize: 18 };
      case 'bug':
      case 'improvement':
      default:
        return { color: theme.text, fontSize: 16 };
    }
  };

  const renderImages = (change: Change, placement: ChangeLogImage['placement']) => {
    const images = change.images?.filter((image) => (image.placement ?? 'top') === placement);

    return images?.map((image) => {
      const imageSource = CHANGELOG_IMAGES[image.source];
      if (!imageSource) return null;

      return (
        <View key={`${change.title}-${image.source}-${placement}`} style={styles.imageContainer}>
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel={image.accessibilityLabel}
            resizeMode="contain"
            source={imageSource}
            style={styles.image}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.contentContainer}>
      {changelog?.changes.map((change) => {
        const fontStyle = getFontStyle(change);
        return (
          <View key={change.title} style={styles.changeBlock}>
            {renderImages(change, 'top')}
            <Text
              variant="heading3"
              style={{ fontSize: fontStyle.fontSize, color: fontStyle.color }}>
              {change.title}
            </Text>
            {change.description?.map((description, index) => {
              const sanitized = sanitizeText(description);
              return (
                <Text key={`${change.title}-${index}`} style={{ color: theme.text }}>
                  {sanitized}
                </Text>
              );
            })}
            {renderImages(change, 'bottom')}
          </View>
        );
      })}
    </View>
  );
};

export default ChangelogContent;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 24,
    width: '100%',
  },
  changeBlock: {
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingBottom: 4,
    width: '100%',
  },
  image: {
    borderRadius: 8,
    height: CHANGELOG_IMAGE_HEIGHT,
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    height: CHANGELOG_IMAGE_HEIGHT,
    marginBottom: 12,
    maxWidth: '100%',
    overflow: 'hidden',
    width: '100%',
  },
});
