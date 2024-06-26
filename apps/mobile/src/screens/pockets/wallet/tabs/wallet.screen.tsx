import { StackScreenProps } from '@react-navigation/stack';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { uniqueTransactions } from 'utils/array';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

import RoundButtonComponent from 'components/shared/input/round-button/round-button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import TransactionList from 'components/wallets/transactions/transaction-list.component';
import WalletMainItem from 'components/wallets/wallet-item/wallet-main-item.component';
import { RefreshControl } from 'react-native';
import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';

type Props = StackScreenProps<PocketsStackParamList, 'Wallet'>;

const Wallet = ({ navigation, route }: Props) => {
  const { account } = route.params;
  const { derivedUntilLevel } = useDeriveState();
  const { getAccountBalance, getAccountTransactions } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const { getAccountAddresses } = useBitcoinState();
  const addresses = getAccountAddresses(account);

  const {
    external,
    change: { address: changeAddress },
  } = addresses;

  const transactions = uniqueTransactions(getAccountTransactions(account));

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => update(account)} />}
      contentInsetAdjustmentBehavior="automatic"
      className="h-full bg-white">
      <View className="mt-3 w-full px-4">
        <WalletMainItem
          key={account}
          account={account}
          disabled={true}
          balance={getAccountBalance(account)}
          navigate={() => navigation.navigate('Wallet', { account: account })}
        />
      </View>
      <View className="bg-transparent mt-10 flex flex-row items-center justify-center px-5">
        <View className="mr-16 w-14">
          <RoundButtonComponent
            onPress={() => navigation.navigate('Send', { external: external })}
            iconName="Send">
            Send
          </RoundButtonComponent>
        </View>
        <View className="mr-16 w-16">
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
            onPress={() => navigation.navigate('ComingSoon', { text: 'Add funds' })}
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
        <MonoIcon iconName="ArrowDown" color="#0AAFFF" width={16} height={16} strokeWitdth={2.5} />
      </View>
      <View>
        <TransactionList
          onItemPressed={transaction => {
            navigation.navigate('TransactionDetails', {
              transaction: transaction,
              externalAddress: external.address,
              changeAddress: changeAddress,
            });
          }}
          loading={derivedUntilLevel < DerivedUntilLevel.COMPLETE}
          address={external.address}
          changeAddress={changeAddress}
          transactions={transactions}
        />
      </View>
    </ScrollView>
  );
};

export default Wallet;
