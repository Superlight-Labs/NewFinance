import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { truncate } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';

export type Contact = {
  name: string;
  lastInteraction: Date;
  type: 'sendedTo' | 'receivedFrom';
};

type Props = {
  contact: Contact;
};

const Contact = ({ contact }: Props) => {
  return (
    <View className="flex w-full flex-row items-center rounded-lg bg-slate-100 p-4">
      <View className="flex items-center justify-center rounded-lg bg-slate-900 p-4">
        {contact.type === 'sendedTo' ? (
          <MonoIcon color="white" iconName="Send" />
        ) : (
          <MonoIcon color="white" iconName="ArrowDownCircle" />
        )}
      </View>
      <View className="ml-4 flex flex-col justify-around">
        <Text className="mb-2 w-36">{truncate(contact.name, 32)}</Text>

        <Text>{contact.lastInteraction.toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

export default Contact;
