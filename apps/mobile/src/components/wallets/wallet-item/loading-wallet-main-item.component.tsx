import ProgressBar from 'components/shared/loading/progress-bar.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { ActivityIndicator } from 'react-native';
import { Image, ImageBackground, Text, View } from 'utils/wrappers/styled-react-native';

const LoadingWalletMainItem = () => {
  return (
    <View className={'shadow-lg transition-all '}>
      <ImageBackground
        source={require('../../../../assets/images/pockets/pocket_black.png')}
        resizeMode="contain"
        className="h-[192px] w-full">
        <View className="h-full flex-col justify-between px-5 py-6 pt-5">
          <View className="flex-row justify-between ">
            <ActivityIndicator />
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <MonoIcon
                color="#927A5F"
                width={24}
                height={24}
                strokeWitdth={2.5}
                iconName="Bitcoin"
              />
            </View>
          </View>
          <View className="mt-2 w-full flex-row items-end justify-between">
            <View className="items-start">
              <View className="flex-row items-center rounded-sm bg-[#ffffff34] px-1.5 py-0.5 blur-lg">
                <Image
                  source={require('../../../../assets/images/icon_bitcoin.png')}
                  className="mr-1 h-3 w-3"
                />
                <Text className="font-manrope text-xs font-bold text-white">Bitcoin only</Text>
              </View>
              <Text className="mt-1 font-manrope text-2xl font-bold text-white">Wallet</Text>
            </View>
            <Text className="font-manrope text-2xl font-bold text-white">0,00€</Text>
          </View>
          <ProgressBar loadingTime={15000} style="w-full" />
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoadingWalletMainItem;
