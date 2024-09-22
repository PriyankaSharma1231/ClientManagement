import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './dashboard';
import Management from './managemnt';

const Stack = createNativeStackNavigator();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ClientManagement" component={Management} />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
