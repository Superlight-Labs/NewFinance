import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { RootStack } from 'src/App';
import { MenuStackParamList } from './menu-navigation';
import Menu from './menu.screen';

type Props = {
  Stack: RootStack;
};

const SubStack = createStackNavigator<MenuStackParamList>();

const screenOptions: StackNavigationOptions = {};
const MenuStack = ({ Stack }: Props) => {
  return (
    <Stack.Group
      screenOptions={{
        gestureEnabled: true,
      }}>
      <Stack.Screen name="Menu">
        {() => (
          <SubStack.Navigator initialRouteName="MenuList" screenOptions={screenOptions}>
            <SubStack.Screen name="MenuList" component={Menu} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default MenuStack;
