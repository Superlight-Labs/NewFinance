import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import ContactComponent, { Contact } from './contact.component';

type Props = {
  lastInteractions: Contact[];
};

const ContactList = ({ lastInteractions }: Props) => {
  return (
    <View className="mt-2 flex w-full flex-1 flex-col px-2 pb-4">
      <View className="mb-4 flex w-full flex-row justify-between ">
        <Text className=" font-bold">Last interactions</Text>
        <MonoIcon color="#5BB5A2" iconName="Search" />
      </View>

      {lastInteractions.length === 0 ? (
        <View className="flex flex-1 items-center justify-center">
          <MonoIcon color="#8D93A0" iconName="UserX" />
          <Text className="font-bold text-slate-400">You dont have any interactions yet</Text>
        </View>
      ) : (
        <ScrollView className="">
          {lastInteractions.map(contact => (
            <ContactComponent contact={contact} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ContactList;
