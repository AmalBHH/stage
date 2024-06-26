import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";
import ProfileEmp from "../screens/ProfileEmp";

import CalendarPage from "../screens/CalendarPage";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
        
      />
            <Stack.Screen
        name="ProfileEmp"
        component={ProfileEmp}
        options={{
          headerShown: false,
        }}
        
      />

    </Stack.Navigator>
  );
}
