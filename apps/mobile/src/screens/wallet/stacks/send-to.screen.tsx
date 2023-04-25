import { StackScreenProps } from '@react-navigation/stack';
import { Contact } from '@superlight-labs/api/src/repository/contact';
import { useQuery } from '@tanstack/react-query';
import validate from 'bitcoin-address-validation';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import ContactList from 'components/wallets/contacts/contact-list.component';
import { useDebounce } from 'hooks/useDebounced';
import { useEffect, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { backend } from 'utils/superlight-api';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendTo'>;

const SendToScreen = ({ navigation, route }: Props) => {
  const { sender, recipient } = route.params;
  const [toAddress, setToAddress] = useState(recipient || '');
  const [recipientName, setRecipientName] = useState('');
  const [addressValid, setAddressValid] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [note, setNote] = useState('');

  const debouncedToAddress = useDebounce(toAddress, 500);

  const { data: contactsRes } = useQuery(
    ['contact', sender.address, debouncedToAddress],
    () =>
      backend
        .get<Contact[]>(`/contact/${sender.address}?peerAddress=${debouncedToAddress}`)
        .then(res => res.data),
    { retry: false }
  );

  if (contactsRes !== undefined && contactsRes.length !== contacts.length) {
    setContacts(contactsRes);
  }

  useEffect(() => {
    const addContactNew = toAddress.length > 0 && !!contactsRes && contactsRes.length === 0;
    setAddContact(addContactNew);
  }, [contactsRes]);

  const addressChange = (address: string) => {
    const valid = validate(address);
    setAddressValid(valid);
    setToAddress(address);
  };

  const onContinue = () => {
    const contact = {
      address: toAddress,
      name: recipientName,
      new: addContact,
    };

    navigation.navigate('SendAmount', { toAddress, note, sender, contact });
  };

  const onSelectContact = (contact: Contact) => {
    setToAddress(contact.address);
    setRecipientName(contact.name);
    setAddressValid(true);
    setAddContact(false);
  };

  return (
    <WalletLayout leftHeader="copy" address={sender.address}>
      <View className="flex w-full flex-1 flex-col bg-white p-4 pt-12">
        <View className="mb-4 flex flex-row border-b border-slate-200 pb-2">
          <Text className="top-0.5 mx-2 font-bold">To: </Text>
          <TextInputComponent
            value={toAddress}
            style="border-0 flex-1 font-bold"
            placeHolder="BTC Address"
            onChangeText={addressChange}
          />
          <Pressable onPress={() => navigation.navigate('ScanQrCode', { sender })}>
            <MonoIcon style="ml-auto flex items-center bg-white w-8" iconName="Camera" />
          </Pressable>
        </View>
        {addContact && (
          <View className="mb-4 flex flex-row border-b border-slate-200 pb-2">
            {/* <Text className="top-0.5 mx-2 font-bold">Name: </Text> */}
            <TextInputComponent
              value={recipientName}
              style="border-0 flex-1 ml-11 font-bold"
              placeHolder="Name of your new Contact"
              onChangeText={setRecipientName}
            />
          </View>
        )}
        <View className="mb-4 flex flex-row border-b  border-slate-200 pb-2">
          <Text className="top-0.5 mx-2 font-bold">For:</Text>
          <TextInputComponent
            value={note}
            style="border-0 flex-1 font-bold"
            onChangeText={setNote}
            placeHolder="Add a Note if you want"
          />
        </View>
        {
          <ContactList
            search={toAddress}
            onSelectContact={onSelectContact}
            lastInteractions={contacts}
          />
        }
        <ButtonComponent
          shadow
          disabled={!addressValid || toAddress === sender.address}
          style=" mt-auto mb-8 rounded-lg"
          onPress={onContinue}>
          Continue
        </ButtonComponent>
      </View>
    </WalletLayout>
  );
};

export default SendToScreen;
