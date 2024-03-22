/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import logger from '@superlight-labs/logger';
import 'react-native-gesture-handler';

import { API_URL, REACTOTRON_COMMANDS } from '@env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteLocalData } from 'hooks/useDeleteLocalData';
import reactotron from 'reactotron-react-native';
import { View } from 'utils/wrappers/styled-react-native';
import AppNavigation from './App.navigation';

if (__DEV__) {
  import('./../ReactotronConfig').then(() => logger.info('Reactotron Configured'));
  // console.log = reactotron.log!;
}

console.log({ API_URL });

function App(): JSX.Element {
  const { deleteLocalData: logout } = useDeleteLocalData();

  const queryClient = new QueryClient();

  console.log({ REACTOTRON_COMMANDS });
  if (__DEV__ && REACTOTRON_COMMANDS) {
    reactotron.onCustomCommand({
      id: 0,
      command: 'Logout',
      description: 'Deleting local states and device keypair',
      handler: logout,
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View className="h-screen w-screen bg-white">
        <AppNavigation />
      </View>
    </QueryClientProvider>
  );
}

export default App;
