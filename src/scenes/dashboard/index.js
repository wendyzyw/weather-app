import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, TouchableHighlight} from 'react-native';
import {ListItem, Avatar, Button} from 'react-native-elements';
import config from '../../assets/config.json';

const Dashboard = ({navigation}) => {
    const cityList = [
        {
            name: 'Sydney',
            temperature: 0,
            id: 2147714
        },
        {
            name: 'Melbourne',
            temperature: 0,
            id: 2158177
        },
        {
            name: 'Brisbane',
            temperature: 0,
            id: 2174003
        }
    ];
    const [weather, setWeather] = useState({cityList: []});

    useEffect( () => {
        // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
        Promise.all( cityList.map(city => {
            const query = config.API_CALL_WEATHER_CITY_ID + '?id=' + city.id + '&units=metric&appid=' + config.API_KEY;
            return fetch(query).then(res => res.json());
        }) )
            .then(data => {
                cityList.map((city, i) => city.temperature = data[i].main.temp);
                setWeather({cityList: cityList});
            })
            .catch(error => console.log(error));
    }, [] );

    return (
        <SafeAreaView>
            <TouchableHighlight>
                <View>
                    {weather.cityList.map( (city, index) => (
                        <ListItem key={index}>
                            <View style={{display: 'flex', flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                <Text>{city.name}</Text></View>
                                <View><Text>{city.temperature}</Text></View>
                            </View>
                        </ListItem>
                    ))}
                    <ListItem>
                        <Button title='Add more cities'/>
                    </ListItem>
                </View>
            </TouchableHighlight>
        </SafeAreaView>
    );
}
export default Dashboard;
