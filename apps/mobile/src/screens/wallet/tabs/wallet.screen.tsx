import Button from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';
import { Text, View } from 'utils/wrappers/styled-react-native';

const Wallet = () => {
  const { name, derivedUntilLevel } = useBip32State();
  const {
    indexAddress: { balance, transactions, address },
  } = useBitcoinState();

  return (
    <WalletLayout leftHeader="copy">
      <View className="flex h-full w-full flex-col items-center  bg-white pb-8">
        <Title style="mt-24">{name}</Title>
        <Title>{balance ? balance.incoming - balance.outgoing : 0} BTC</Title>

        <Button shadow style="w-48 my-4 rounded-xl" onPress={() => undefined}>
          Add Cash
        </Button>
        <Button style="w-48 mb-32 bg-white border-2 rounded-xl" onPress={() => undefined}>
          <Text className="text-black">Cash out</Text>
        </Button>
        <TransactionList
          loading={derivedUntilLevel < 7}
          address={address}
          transactions={transactions}
        />
      </View>
    </WalletLayout>
  );
};

export default Wallet;
