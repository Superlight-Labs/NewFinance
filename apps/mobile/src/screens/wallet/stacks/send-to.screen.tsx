import { StackScreenProps } from '@react-navigation/stack';
import validate from 'bitcoin-address-validation';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import ContactList from 'components/wallets/contacts/contact-list.component';
import { useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendTo'>;

const SendToScreen = ({ navigation }: Props) => {
  const [toAddress, setToAddress] = useState('');
  const [note, setNote] = useState('');
  return (
    <WalletLayout leftHeader="copy">
      <View className="flex w-full flex-1 flex-col bg-white p-4 pt-12">
        <View className="mb-4 flex flex-row border-b border-slate-200 pb-2">
          <Text className="top-0.5 mx-2 font-bold">To: </Text>
          <TextInputComponent
            value={toAddress}
            style="border-0 flex-1 font-bold"
            placeHolder="BTC Address"
            onChangeText={setToAddress}
          />
          <MonoIcon style="ml-auto flex items-center bg-white w-8" iconName="Camera" />
        </View>
        <View className="mb-4 flex flex-row border-b  border-slate-200 pb-2">
          <Text className="top-0.5 mx-2 font-bold">For:</Text>
          <TextInputComponent
            value={note}
            style="border-0 flex-1 font-bold"
            onChangeText={setNote}
            placeHolder="Add a Note if you want"
          />
        </View>
        <ContactList lastInteractions={[]} />
        <ButtonComponent
          shadow
          disabled={!validate(toAddress)}
          style=" mt-auto mb-8 rounded-lg"
          onPress={() => navigation.navigate('SendAmount', { toAddress, note })}>
          Continue
        </ButtonComponent>
      </View>
    </WalletLayout>
  );
};

export default SendToScreen;
