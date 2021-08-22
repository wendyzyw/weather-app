import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import Welcome from "./scenes/welcome";
import Dashboard from "./scenes/dashboard";

const Stack = createStackNavigator();

const AppContainer = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppContainer;
