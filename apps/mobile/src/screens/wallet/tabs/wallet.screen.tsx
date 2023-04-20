import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { RefreshControl } from 'react-native';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';
import { safeBalance } from 'utils/crypto/bitcoin-value';
import { ScrollView, Text } from 'utils/wrappers/styled-react-native';
import { WalletTabList } from '../wallet-navigation';

type Props = StackScreenProps<WalletTabList, 'Overview'>;

const Wallet = ({ navigation }: Props) => {
  const { name, derivedUntilLevel } = useBip32State();
  const {
    indexAddress: { balance, transactions, address },
  } = useBitcoinState();

  const { refreshing, update } = useUpdateWalletData();

  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={update} />;

  return (
    <WalletLayout leftHeader="copy">
      <ScrollView
        nestedScrollEnabled
        refreshControl={refreshControl}
        contentContainerStyle={{ alignItems: 'center' }}
        className="flex h-full w-full flex-col bg-white pb-8">
        <Title style="mt-24">{name}</Title>
        <Title>{balance ? safeBalance(balance) : 0} BTC</Title>

        <Button shadow style="w-48 my-4 rounded-xl" onPress={() => navigation.navigate('Send')}>
          Send
        </Button>
        <Button
          style="w-48 mb-24 bg-white border-2 rounded-xl"
          onPress={() => navigation.navigate('Recieve')}>
          <Text className="text-black">Recieve</Text>
        </Button>
        <TransactionList
          loading={derivedUntilLevel < 7}
          address={address}
          transactions={transactions}
        />
      </ScrollView>
    </WalletLayout>
  );
};

export default Wallet;
