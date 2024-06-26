import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './Dashboard';
import SidebarScreen from './sidebar';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Dashboard} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
