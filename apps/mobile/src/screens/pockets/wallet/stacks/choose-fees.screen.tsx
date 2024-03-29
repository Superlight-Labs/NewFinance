import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import RadioButtonGroupComponent from 'components/shared/input/radio-button/radio-button-group.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { SendStackList } from 'screens/pockets/pockets-navigation';
import { AnimatedView, Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<SendStackList, 'ChooseFees'>;

const ChooseFeesScreen = ({ navigation, route }: Props) => {
  const { fees, currency, currentFee } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { getPrice } = useBitcoinPrice();

  const [customFee, setCustomFee] = useState((currentFee * getPrice(currency)).toFixed(2));
  const [fee, setFee] = useState(currentFee);

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      navigation.navigate({
        name: 'SendReview',
        //TODO remove "as any" by passing the correct params. It works because of the merge: true,
        // but is not relyable as the parent params are only there if the component is used in a specific way
        params: { customFee: fee } as any,
        merge: true,
      });
    }, 55);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 300,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="h-full">
      <View className="h-full items-center text-center">
        <AnimatedView
          className="h-full w-full bg-black"
          style={{
            opacity: fadeAnim,
          }}>
          <Pressable onPress={closeModal} className="h-full w-full" />
        </AnimatedView>
        <View className="absolute bottom-0 w-full rounded-t bg-white px-5 pb-10 pt-12 text-center shadow-2xl">
          <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
            Choose fees
          </Text>

          <View className="mt-6 flex flex-row items-center border-b border-[#ECF2EF] pb-4">
            <Text className="flex items-center font-manrope font-bold text-grey">Custom: </Text>
            <TextInputComponent
              value={customFee}
              style="flex-1 border-0"
              placeHolder="0.00"
              onChangeText={value => setCustomFee(value)}
              onBlur={() => setFee(parseFloat(customFee) / getPrice())}
              autoFocus={false}
            />
            <Text className="flex items-center font-manrope font-bold text-grey">{currency}</Text>
          </View>

          <View className="w-full">
            <RadioButtonGroupComponent
              items={fees}
              selected={fees.find(item => item.value === fee)}
              onSelectionChange={item => {
                setFee(item.value);
                setCustomFee((getPrice() * item.value).toFixed(2).toString());
              }}
            />
          </View>
          <View className="mt-8 w-full">
            <ButtonComponent onPress={closeModal} style="bg-[#3385FF]" textStyle="text-white">
              Use
            </ButtonComponent>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChooseFeesScreen;
