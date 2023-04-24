import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { RefreshControl } from 'react-native';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { ScrollView, Text } from 'utils/wrappers/styled-react-native';
import { WalletTabList } from '../wallet-navigation';

type Props = StackScreenProps<WalletTabList, 'Overview'>;

const Wallet = ({ navigation, route }: Props) => {
  const { account } = route.params;
  const { derivedUntilLevel } = useDeriveState();
  const { getAccountBalance, getAccountAddresses, getAccountTransactions } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const {
    external: { address },
    change: { address: changeAddress },
  } = getAccountAddresses(account);

  const transactions = getAccountTransactions(account);

  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={update} />;

  return (
    <WalletLayout leftHeader="copy" address={address}>
      <ScrollView
        nestedScrollEnabled
        refreshControl={refreshControl}
        contentContainerStyle={{ alignItems: 'center' }}
        className="flex h-full w-full flex-col bg-white pb-8">
        <Title style="mt-24">{account}</Title>
        <Title>{getAccountBalance(account)} BTC</Title>

        <Button
          shadow
          style="w-48 my-4 rounded-xl"
          onPress={() => navigation.navigate('Send', { account })}>
          Send
        </Button>
        <Button
          style="w-48 mb-24 bg-white border-2 rounded-xl"
          onPress={() => navigation.navigate('Recieve', { account })}>
          <Text className="text-black">Recieve</Text>
        </Button>
        <TransactionList
          loading={derivedUntilLevel < DerivedUntilLevel.COMPLETE}
          address={address}
          changeAddress={changeAddress}
          transactions={transactions}
        />
      </ScrollView>
    </WalletLayout>
  );
};

export default Wallet;
