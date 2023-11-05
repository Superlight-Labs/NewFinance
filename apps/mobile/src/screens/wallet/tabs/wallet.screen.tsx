import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import InteractiveLineChart from 'components/wallets/charts/interactivelinechart.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { RefreshControl } from 'react-native';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { uniqueTransactions } from 'utils/array';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { WalletTabList } from '../wallet-navigation';

import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { bitcoinData1Y } from 'components/wallets/bitcoin/historical-data/bitcoin-data-1Y';
import { useState } from 'react';

type Props = StackScreenProps<WalletTabList, 'Overview'>;

const Wallet = ({ navigation, route }: Props) => {
  const { account, addresses } = route.params;
  const { derivedUntilLevel } = useDeriveState();
  const { getAccountBalance, getAccountTransactions } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const [transactionsOffset, setTransactionsOffset] = useState<number>();

  const {
    external,
    change: { address: changeAddress },
  } = addresses;

  const transactions = uniqueTransactions(getAccountTransactions(account));

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={() => update(account)} />
  );

  return (
    <WalletLayout leftHeader="copy" address={external.address}>
      <ScrollView
        snapToOffsets={[transactionsOffset ? transactionsOffset - 150 : 0]}
        decelerationRate="fast"
        refreshControl={refreshControl}
        contentContainerStyle={{ alignItems: 'center' }}
        className="flex h-full w-full flex-col bg-white pb-8">
        <Text className="mb-3 mt-16 font-manrope text-base font-semibold">Balance</Text>
        <PriceTextComponent bitcoinAmount={getAccountBalance(account)} />
        <View className="flex-row items-center">
          <MonoIcon iconName="ArrowDown" width={16} height={16} color={'#FF000F'} />

          <Text className="text-red ml-0.5 font-manrope text-sm font-semibold text-[#FF000F]">
            4,12€ (0,12%)
          </Text>
          <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
          <Text className="font-manrope text-sm font-semibold text-grey">1 month</Text>
        </View>

        <View className="mb-6 mt-6 flex-row">
          <Button
            style="bg-[#F0F6F2] max-w-44 mr-4"
            onPress={() => navigation.navigate('Send', { external })}>
            <Text className="text-black">SELL BITCOIN</Text>
          </Button>
          <Button style=" max-w-44" onPress={() => navigation.navigate('Recieve', { external })}>
            <Text className="text-white">BUY BITCOIN</Text>
          </Button>
        </View>

        <View className="max-h-72">
          <InteractiveLineChart
            data={bitcoinData1Y}
            onTouchRelease={() => {}}
            onValueChange={() => {}}
            height={250}
          />
        </View>
        <View className="mt-6" />
        <TransactionList
          loading={derivedUntilLevel < DerivedUntilLevel.COMPLETE}
          address={external.address}
          changeAddress={changeAddress}
          transactions={transactions}
        />
        <View
          className="bg-red mt-6 pb-96"
          onLayout={event => {
            setTransactionsOffset(event.nativeEvent.layout.y);
          }}>
          <Text className="text-black">test</Text>
        </View>
        <View className="mt-6 pb-96"></View>
      </ScrollView>
    </WalletLayout>
  );
};

export default Wallet;
