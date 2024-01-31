import { Contact } from '@superlight-labs/api/src/repository/contact';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { shortenAddress } from 'utils/string';
import { Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import ContactComponent from './contact.component';

type Props = {
  lastInteractions: Contact[];
  search: string;
  onSelectContact: (contact: Contact) => void;
};

const ContactList = ({ lastInteractions, search, onSelectContact }: Props) => {
  return (
    <View className="flex-colpb-4 flex w-full">
      {lastInteractions.length === 0 ? (
        <View className="flex-row">
          <MonoIcon color="#8D93A0" iconName="UserX" style="mr-2" />
          {search === '' ? (
            <Text className="font-manrope text-sm font-semibold text-grey">
              Looks like you don't have any interactions yet
            </Text>
          ) : (
            <Text className="font-manrope text-sm font-semibold text-grey">
              No Addresses like "{shortenAddress(search)}" found in your contacts
            </Text>
          )}
        </View>
      ) : (
        <ScrollView className="mt-2" keyboardShouldPersistTaps="handled">
          {lastInteractions.map((contact, i) => (
            <Pressable key={contact.address + i} onPress={() => onSelectContact(contact)}>
              <ContactComponent contact={contact} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ContactList;
