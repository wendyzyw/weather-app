import React from 'react';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from "react-native-safe-area-context";
import AppContainer from "./AppContainer";

const App = () => (
    <SafeAreaProvider>
        <AppContainer />
    </SafeAreaProvider>
);

export default App;
