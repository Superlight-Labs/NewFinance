import { BitcoinBalance } from '@superlight-labs/blockchain-api-client';
import SkeletonBar from 'components/shared/loading/skeleton-bar.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  loading: boolean;
  name?: string;
  balance?: BitcoinBalance;
  navigate: () => void;
};

const WalletMenuItem = ({ loading, name = 'Hauptkonto', balance, navigate }: Props) => {
  return (
    <Pressable className="w-[45rvw]" onPress={navigate}>
      <View className="flex h-[40vw] w-[40vw] items-center justify-center rounded-xl bg-superblue-100">
        <View className="flex h-16 w-16 items-center justify-center rounded-md bg-superblue-400">
          {loading ? (
            <MonoIcon height={32} width={32} strokeWitdth={4} iconName="Loading" color="white" />
          ) : (
            <Text className="text-4xl font-medium text-white">$</Text>
          )}
        </View>
      </View>
      <Text className="mt-3">{name}</Text>
      {loading || !balance ? (
        <SkeletonBar style="h-4" />
      ) : (
        <Text className="text-gray-500">{balance.incoming - balance.outgoing} BTC</Text>
      )}
    </Pressable>
  );
};

export default WalletMenuItem;
