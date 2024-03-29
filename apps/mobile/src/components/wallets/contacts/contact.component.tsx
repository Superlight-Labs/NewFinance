import { Contact as ContactType } from '@superlight-labs/api/src/repository/contact';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { shortenAddress, truncate } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  contact: ContactType;
  active: boolean;
};

const Contact = ({ contact, active }: Props) => {
  return (
    <View
      className={`mb-2 flex w-full flex-row items-center justify-between rounded ${
        active ? 'border' : ''
      }`}>
      <View className="flex-row">
        <View className="flex flex-col justify-around">
          <Text className="mb-0.5 font-manrope-semibold text-base">
            {truncate(contact.name || '', 48)}
          </Text>

          <Text className="font-manrope text-xs font-semibold text-[#8D8C91]">
            {shortenAddress(contact.address)}
          </Text>
        </View>
      </View>
      <MonoIcon color="#91969D" iconName="ChevronRight" />
    </View>
  );
};

export default Contact;
