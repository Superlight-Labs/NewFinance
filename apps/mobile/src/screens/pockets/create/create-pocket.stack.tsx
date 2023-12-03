import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';

import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';
import CreatePocketIconScreen from './create-pocket-icon.screen';
import CreatePocketNameScreen from './create-pocket-name.screen';
import { CreatePocketsStackParamList } from './create-pocket-navigation';
import CreatePocketTypeScreen from './create-pocket-type.screen';

const Stack = createNativeStackNavigator<CreatePocketsStackParamList>();

type Props = StackScreenProps<PocketsStackParamList, 'CreatePocket'>;

const CreatePocketStack = ({}: Props) => {
  const stackOptions = () => ({
    headerShown: false,
  });

  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="CreatePocketType" component={CreatePocketTypeScreen} />
      <Stack.Screen name="CreatePocketName" component={CreatePocketNameScreen} />
      <Stack.Screen name="CreatePocketIcon" component={CreatePocketIconScreen} />
    </Stack.Navigator>
  );
};

export default CreatePocketStack;
