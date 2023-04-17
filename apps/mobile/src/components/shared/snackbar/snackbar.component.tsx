import { AppMessage, useSnackbarState } from 'state/snackbar.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  appMessage: AppMessage;
};

const Snackbar = ({ appMessage }: Props) => {
  const { message, level } = appMessage;
  const { resetMessage } = useSnackbarState();
  return (
    <Pressable onPress={resetMessage} className={`${colors[level]}-900 flex py-4 text-center`}>
      <View
        className={`${colors[level]}-800 flex flex-row items-center justify-center rounded-full p-2 text-center ${colors[level]}-100`}>
        <Text
          className={`mr-3 rounded-full ${colors[level]}-500 px-2 py-1 text-xs font-bold uppercase`}>
          {level}
        </Text>
        <Text className={'mr-2 font-semibold'}>{message}</Text>
      </View>
    </Pressable>
  );
};

const colors: Color = {
  error: 'bg-rose',
  info: 'bg-cyan',
  success: 'bg-emerald',
  warning: 'bg-amber',
  empty: '',
};

type Color = {
  [key in AppMessage['level']]: string;
};

export default Snackbar;
