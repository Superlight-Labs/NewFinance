import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  navigate: () => void;
};

const WalletMenuAdd = ({ navigate }: Props) => {
  return (
    <Pressable
      className="mb-5 aspect-[1] h-56 w-[48%] flex-col items-center justify-center rounded-md border-[1px] border-[#EEEEEE] px-5 py-6 pt-5 transition-all active:opacity-70"
      onPress={navigate}>
      <Text className="text-center font-manrope text-sm font-bold text-[#0AAFFF]">
        + Add pocket
      </Text>
    </Pressable>
  );
};

export default WalletMenuAdd;
