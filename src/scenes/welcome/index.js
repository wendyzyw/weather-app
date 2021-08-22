import React from 'react';
import {View,Text,Button} from 'react-native';

const Welcome = ({ navigation }) => (
    <View>
        <Text>Welcome</Text>
        <Button title="skip" onPress={() => navigation.navigate('Dashboard')}/>
    </View>
);

export default Welcome;
