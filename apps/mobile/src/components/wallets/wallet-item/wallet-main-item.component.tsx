import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { Image, ImageBackground, Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
  balance: number;
  disabled?: boolean;
  navigate: () => void;
};

const WalletMainItem = ({ name, balance, navigate, disabled = false }: Props) => {
  return (
    <Pressable
      className={`shadow-lg transition-all   ${!disabled ? 'active:opacity-95' : ''}`}
      onPress={navigate}>
      <ImageBackground
        source={require('../../../../assets/images/pockets/pocket_black.png')}
        resizeMode="contain"
        className="h-[192px] w-full">
        <View className="h-full flex-col justify-between px-5 py-6 pt-5">
          <View />
          <View className="mt-2 w-full flex-row items-end justify-between">
            <View className="items-start">
              <View className="flex-row items-center rounded-sm bg-[#ffffff34] px-1.5 py-0.5 blur-lg">
                <Image
                  source={require('../../../../assets/images/icon_bitcoin.png')}
                  className="mr-1 h-3 w-3"
                />
                <Text className="font-manrope text-xs font-bold text-white">Bitcoin only</Text>
              </View>
              <Text className="mt-1 font-manrope text-2xl font-bold text-white">{name}</Text>
            </View>
            <PriceTextComponent
              style="font-manrope text-2xl font-bold text-white"
              disabled={true}
              bitcoinAmount={balance}
            />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default WalletMainItem;
