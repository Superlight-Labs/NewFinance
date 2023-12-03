import { StackScreenProps } from '@react-navigation/stack';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { RefreshControl } from 'react-native';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { uniqueTransactions } from 'utils/array';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

import RoundButtonComponent from 'components/shared/input/round-button/round-button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import WalletMainItem from 'components/wallets/wallet-item/wallet-main-item.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useEffect } from 'react';
import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';

type Props = StackScreenProps<PocketsStackParamList, 'Wallet'>;

const Wallet = ({ navigation, route }: Props) => {
  const { account } = route.params;
  const { derivedUntilLevel } = useDeriveState();
  const { getAccountBalance, getAccountTransactions } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const { getAccountAddresses } = useBitcoinState();
  const addresses = getAccountAddresses(account);
  console.log('addressed:', addresses);
  const { updateBitcoinPrice } = useBitcoinPrice();

  useEffect(() => {
    updateBitcoinPrice();
  }, []);

  const {
    external,
    change: { address: changeAddress },
  } = addresses;

  console.log('shown transact: ', getAccountTransactions(account));

  const transactions = uniqueTransactions(getAccountTransactions(account));

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={() => update(account)} />
  );

  return (
    <SafeAreaView>
      <ScrollView refreshControl={refreshControl} className="h-full bg-white">
        <View className="mt-3 w-full px-4">
          <WalletMainItem
            key={account}
            name={account}
            disabled={true}
            balance={getAccountBalance(account)}
            navigate={() => navigation.navigate('Wallet', { account: account })}
          />
        </View>
        <View className="bg-transparent mt-10 flex flex-row items-center px-5">
          <View className="mr-6 w-14">
            <RoundButtonComponent
              onPress={() => navigation.navigate('Send', { external: external })}
              iconName="Send">
              Send
            </RoundButtonComponent>
          </View>
          <View className="mr-6 w-16">
            <RoundButtonComponent
              style="bg-white border-[1px] border-[#E8E8E8]"
              textStyle="text-black"
              onPress={() => navigation.navigate('Receive', { external: external })}
              iconName="QrCode"
              iconColor="#000000">
              Receive
            </RoundButtonComponent>
          </View>
          <View className="w-16">
            <RoundButtonComponent
              style="bg-white border-[1px] border-[#E8E8E8]"
              textStyle="text-black"
              onPress={() => navigation.navigate('')}
              iconName="Plus"
              iconColor="#000000">
              Add funds
            </RoundButtonComponent>
          </View>
        </View>
        <View className="mx-5 mt-6 border-b-[1.5px] border-[#F6F7F8]" />
        <View className="mt-8 flex-row justify-between px-5">
          <View className="flex-row">
            <Text className="font-manrope-bold text-xs text-grey">Sorted by:</Text>
            <Text className="ml-1 font-manrope-bold text-xs text-[#0AAFFF]">Date</Text>
          </View>
          <MonoIcon
            iconName="ArrowDown"
            color="#0AAFFF"
            width={16}
            height={16}
            strokeWitdth={2.5}
          />
        </View>
        <View>
          <TransactionList
            onItemPressed={transaction => {
              navigation.navigate('TransactionDetails', { transaction: transaction });
            }}
            loading={derivedUntilLevel < DerivedUntilLevel.COMPLETE}
            address={external.address}
            changeAddress={changeAddress}
            transactions={transactions}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wallet;
