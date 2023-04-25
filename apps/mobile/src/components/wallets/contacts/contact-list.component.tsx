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
    <View className="mt-2 flex w-full flex-1 flex-col px-2 pb-4">
      <View className="mb-4 flex w-full flex-row justify-between ">
        <Text className=" font-bold">Last interactions</Text>
        <MonoIcon color="#5BB5A2" iconName="Search" />
      </View>

      {lastInteractions.length === 0 ? (
        <View className="flex flex-1 items-center justify-center">
          <MonoIcon color="#8D93A0" iconName="UserX" />
          {search === '' ? (
            <Text className="text-center font-bold text-slate-400">
              Looks like you dont have any interactions yet
            </Text>
          ) : (
            <Text className="text-center font-bold text-slate-400">
              No Addresses like "{shortenAddress(search)}" found in your contacts
            </Text>
          )}
        </View>
      ) : (
        <ScrollView className="mt-2">
          {lastInteractions.map(contact => (
            <Pressable onPress={() => onSelectContact(contact)}>
              <ContactComponent contact={contact} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ContactList;
