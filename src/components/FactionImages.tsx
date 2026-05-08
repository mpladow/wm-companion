import { Factions } from '@utils/constants';
import { getKeyByValue, getLocalFactionAssets } from '@utils/factionHelpers';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

interface FactionImagesProps {
  factionId: number;
  style?: any;
  imageStyle?: any;
}

const FactionImages: React.FC<FactionImagesProps> = ({ factionId, style, imageStyle }) => {
  // Get the faction name from the ID
  const factionName = getKeyByValue(Factions, factionId);

  if (!factionName) {
    return null;
  }

  // Get the faction images
  const factionImages = getLocalFactionAssets(factionName);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(31,46,39, 0.1)', 'rgba(6,9,7, 0.2)']}
        start={{ y: 0, x: 0.5 }}
        end={{ y: 0.5, x: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -0,
          height: Dimensions.get('screen').height,
          zIndex: 9,
        }}></LinearGradient>
      {factionImages.map((imageSource, index) => (
        <Image
          key={index}
          source={imageSource}
          style={[styles.image, imageStyle, { width: '100%' }]}
          resizeMode="cover"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
  },
});

export default FactionImages;
