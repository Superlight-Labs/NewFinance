import { useHeaderHeight } from '@react-navigation/elements';
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
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { backend } from 'utils/superlight-api';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendTo'>;

const SendToScreen = ({ navigation, route }: Props) => {
  const headerHeight = useHeaderHeight();

  const { sender, recipient, currency, amount } = route.params;
  const [toAddress, setToAddress] = useState('');
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

  useEffect(() => {
    navigation.setOptions({ title: 'Send ' + amount + currency });
  }, []);

  useEffect(() => {
    addressChange(recipient || '');
  }, [recipient]);

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
    const contact: Contact & { new: boolean } = {
      address: toAddress,
      name: recipientName,
      new: addContact,
      userEmail: null,
    };

    navigation.navigate('SendReview', { toAddress, note, sender, contact, amount, currency });
  };

  const onSelectContact = (contact: Contact) => {
    setToAddress(contact.address);
    setRecipientName(contact.name || '');
    setAddressValid(true);
    setAddContact(false);
  };

  if (contactsRes !== undefined && contactsRes.length !== contacts.length) {
    setContacts(contactsRes);
  }

  return (
    <View className="h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}>
        <TouchableWithoutFeedback>
          <View className="h-full flex-col justify-between bg-white px-5">
            <View>
              <View className="flex w-full flex-col pt-6">
                <View className="flex flex-row items-center border-b border-[#ECF2EF] pb-4">
                  <Text className="flex items-center font-manrope font-bold text-grey">To: </Text>
                  <TextInputComponent
                    value={recipientName}
                    style="flex-1 border-0"
                    placeHolder="Recipient's name"
                    onChangeText={setRecipientName}
                    autoCapitalize={true}
                    autoFocus={true}
                  />
                </View>
                <View className="mt-4 flex flex-row items-center border-b border-[#ECF2EF] pb-4">
                  <Text className="flex items-center font-manrope font-bold text-grey">
                    Address:{' '}
                  </Text>
                  <TextInputComponent
                    value={toAddress}
                    style="flex-1 border-0"
                    placeHolder="Bitcoin address"
                    onChangeText={addressChange}
                  />
                  <Pressable
                    onPress={() => navigation.navigate('ScanQrCode', { sender, currency, amount })}>
                    <MonoIcon style="ml-auto flex items-center bg-white w-8" iconName="ScanLine" />
                  </Pressable>
                </View>
                <View className="mt-4 flex flex-row items-center border-b border-[#ECF2EF] pb-4">
                  <Text className="flex items-center font-manrope font-bold text-grey">Note: </Text>
                  <TextInputComponent
                    value={note}
                    style="flex-1 border-0"
                    placeHolder="Add note"
                    onChangeText={setNote}
                  />
                </View>
              </View>

              <View className="mt-6">
                {
                  <ContactList
                    search={toAddress}
                    onSelectContact={onSelectContact}
                    lastInteractions={contacts}
                  />
                }
              </View>
            </View>
            <View style={{ marginBottom: headerHeight + 36 }}>
              <ButtonComponent
                disabled={
                  recipientName.length === 0 ||
                  toAddress.length === 0 ||
                  note.length === 0 ||
                  !addressValid
                }
                onPress={onContinue}>
                Next
              </ButtonComponent>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SendToScreen;

/*

<KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}>
        <View className="h-full flex-col justify-between bg-white px-5">
          
        </View>

*/
