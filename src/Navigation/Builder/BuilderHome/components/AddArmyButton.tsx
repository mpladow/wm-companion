import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button, Text } from '@components/index';
import { Theme } from '@hooks/useTheme';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type AddArmyButtonProps = {
  onAddArmyPress: () => void;
  theme: Theme;
  buttonName: string;
};
const AddArmyButton = ({ onAddArmyPress, theme, buttonName }: AddArmyButtonProps) => {
  const handleAddArmyPress = () => {
    onAddArmyPress;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  return (
    <View
      style={{
        zIndex: 99999,
        position: 'absolute',
        bottom: 30,
        right: 24,
      }}>
      {/* <Button circle onPress={handleAddArmyPress} variant={"confirm"}>
                <AntDesign name='plus' size={24} color='black' />
            </Button> */}
      <Animated.View entering={FadeInDown}>
        <Button onPress={handleAddArmyPress} variant={'confirm'}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign name="plus" size={20} color="black" />
            <Text
              bold
              style={{
                marginLeft: 4,
                color: theme.black,
              }}>
              {buttonName}
            </Text>
          </View>
        </Button>
      </Animated.View>
    </View>
  );
};
export default AddArmyButton;
